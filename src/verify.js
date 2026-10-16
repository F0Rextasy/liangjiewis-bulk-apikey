#!/usr/bin/env node
'use strict';

/**
 * liangjiewis-bulk-apikey · verify — re-check keys already on disk
 *
 * Re-checks keys that are already on disk, on an exit that is *not* the one that
 * minted them (a same-exit pass can be session state rather than key validity):
 *
 *   ① `GET /v1/models` with the key answers 200 (authentic), and
 *   ② a real completion on a cheap listed model comes back — on a fresh account
 *      here that is a credit refusal (`403 insufficient_user_quota`), which is a
 *      fact about the account's balance, not about the key.
 *
 * Verdicts stay apart, because they mean different things:
 *
 *   ok            models 200 and a completion 200 — the key spends today
 *   quota         models 200, completion refused for credit (`insufficient…`)
 *   authentic     models 200, the completion channel answered neither way
 *   key_refused   the panel answered the key itself (401 `invalid_api_key`)
 *   account_banned the panel banned the account (`auth.user_banned`)
 *   error         no candidate exit answered — the key was never measured
 *
 *   node src/verify.js                 # every key on disk that is not already ok
 *   node src/verify.js --key <key>     # one key
 *   node src/verify.js --all           # also re-check keys whose last run said ok
 *   node src/verify.js --model claude-3-5-haiku-20241022
 *
 * Verdicts are written to `accounts.json` — the current verdict in `verify`
 * (`status`, `verdict`, `exit`, `at`), the measurement taken when the key was
 * minted kept in `verify.atMint` — a fresh model list to `models.json`, the exits
 * that proved reachable to `out/screened-<host>.txt`, the run's lines to
 * `out/verify.log`, and a key is appended to `keys.txt` only when it is `ok`.
 */

const fs = require('fs');
const path = require('path');

const { ExitPool, loadExits, readJson, writeJson, appendLine, nowIso, req, isExitError } = require('./lib.js');
const { Panel } = require('./newapi.js');

const BASE = 'https://liangjiewis.com';
const HOST = new URL(BASE).host;
const ROOT = path.resolve(__dirname, '..'); // the checkout root: user-facing files live here
const POOL = path.join(ROOT, 'proxies.txt');
const ACCOUNTS = path.join(ROOT, 'accounts.json');
const KEYS = path.join(ROOT, 'keys.txt');
const MODELS_FILE = path.join(ROOT, 'models.json');
const OUT = path.join(ROOT, 'out');

const USAGE = `liangjiewis-bulk-apikey · verify — re-check keys already on disk

usage: node src/verify.js [options]

  --key K          verify one key instead of every key on disk
  --all            also re-check keys whose last run said they work
  --model ID[,ID]  model(s) for the completion check (default: cheapest listed)
  --max-tokens N   tokens to ask for (default 8)
  --want N         independent exits to prove before checking keys (default 3)
  --pool FILE      exit list, one per line (default proxies.txt)
  --base URL       panel address (default ${BASE})
  --help           this text

Every call rides an exit from proxies.txt; the exit that verified a key is
recorded next to the exit that minted it, so "the key works" is never confused
with "this session works". A key no exit could be measured on is reported as
unmeasured (\`error\`), never as dead.`;

const argv = process.argv.slice(2);
const has = (name) => argv.includes(`--${name}`);
const one = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : null;
};

if (has('help') || has('-h') || argv.includes('-h')) {
  console.log(USAGE);
  process.exit(0);
}

const FLAGS = ['--key', '--all', '--model', '--max-tokens', '--want', '--pool', '--base'];
for (const a of argv) {
  if (a.startsWith('-') && !FLAGS.includes(a)) {
    console.error(`unknown flag: ${a}\n`);
    console.log(USAGE);
    process.exit(2);
  }
}

const pool = path.resolve(ROOT, one('pool') || POOL);
if (!fs.existsSync(pool)) {
  console.error(`no exit list at ${pool}\n  one exit per line, e.g. socks5://127.0.0.1:1080 — see README "Behind a proxy"`);
  process.exit(2);
}

const BASE_URL = one('base') || BASE;
const ONLY_KEY = one('key') || '';
const ALL = has('all');
const MODELS = (one('model') || '').split(',').map((s) => s.trim()).filter(Boolean);
const MAX_TOKENS = parseInt(one('max-tokens') || '8', 10);
const WANT = parseInt(one('want') || '3', 10);
const MAX_EXITS = Math.max(WANT, 4); // every key may burn this many exits before the run calls it unmeasured

try {
  fs.mkdirSync(OUT, { recursive: true });
} catch (e) {}

const log = (...a) => {
  const line = `[${nowIso()}] ${a.join(' ')}`;
  console.log(line);
  appendLine(path.join(OUT, 'verify.log'), line);
};
const CHATTY = /embed|rerank|reranker|whisper|tts|image|audio|video|vision|bge/i;

/** Cheap-model ranking — the same heuristic the mint uses. */
function rankCheapest(ids) {
  const rank = (id) => {
    let s = 5;
    if (/flash|nano|mini|small|lite|turbo|haiku|8b|7b|4b|1b/i.test(id)) s -= 3;
    if (/free/i.test(id)) s -= 2;
    if (/pro|opus|ultra|max|72b|70b|235b|405b|550b/i.test(id)) s += 3;
    if (/embed|rerank|whisper|tts|image|audio|video|vision/i.test(id)) s += 4;
    return s;
  };
  return [...ids].sort((a, b) => rank(a) - rank(b));
}

const looksQuota = (text) => /insufficient|quota|额度|余额|balance/i.test(String(text || ''));
const looksAccountBanned = (text) => /user_banned|user banned|账号封禁|账号已被封禁|account.*banned/i.test(String(text || ''));

/** What the panel answered for a key, never for the exit. */
function classify(models, chat) {
  if (models.status === 200) {
    if (chat && chat.status === 200) return 'ok';
    if (chat && looksQuota(chat.text)) return 'quota';
    return 'authentic';
  }
  if (looksAccountBanned(models.text)) return 'account_banned';
  return 'key_refused';
}

/** A cursor over the screened exits, skipping the mint exit and every dead line. */
class ExitCursor {
  constructor(pool, { avoid = [] } = {}) {
    this.queue = pool.slice();
    this.skip = new Set(avoid.filter(Boolean));
    this.proven = []; // exits that answered a panel answer for some key — worth more than an untried candidate
  }
  take() {
    while (this.queue.length) {
      const p = this.queue.shift();
      if (!p || this.skip.has(p.line)) continue;
      return p;
    }
    // Untried candidates are gone: an exit that already answered may carry the
    // next key, so a small pool does not leave keys unmeasured. Failed exits
    // remove themselves from `proven`, so this cannot loop on a bad one.
    return this.proven.find((p) => !this.skip.has(p.line)) || null;
  }
  died(line) {
    if (line) this.skip.add(line);
    this.proven = this.proven.filter((p) => p.line !== line);
  }
  answered(pin) {
    if (pin && !this.proven.some((p) => p.line === pin.line)) this.proven.push(pin);
  }
}

function panelOn(pin) {
  return new Panel(BASE_URL, new ExitPool([pin], { label: 'liangjiewis' }), { label: 'liangjiewis', log: () => {} });
}

/** Screening probe: does this exit answer the panel's own status route right now? */
async function reachable(p) {
  const res = await req(p, `${BASE_URL}/api/status`, { timeoutMs: 20000, connectTimeoutMs: 6000, headers: { accept: 'application/json' } });
  return res.status === 200 && /\{/.test(String(res.text).slice(0, 120));
}

/** Probe candidates until `want` exits answer, in parallel, inside a budget. */
async function screen(candidates, { want, conc, budgetMs }) {
  const good = [];
  const tried = [];
  const limit = Math.min(candidates.length, Math.max(want * 20, 60));
  let i = 0;
  const started = Date.now();
  const lanes = Array.from({ length: Math.min(conc, candidates.length) }, async () => {
    while (good.length < want && i < limit && Date.now() - started < budgetMs) {
      const p = candidates[i++];
      if (!p) return;
      tried.push(p.line);
      try {
        if (await reachable(p)) {
          good.push(p);
          log(`  ✓ screened ${p.line}`);
        }
      } catch (e) {
        /* an exit that does not answer costs one try, not the run */
      }
    }
  });
  await Promise.all(lanes);
  return { good, tried };
}

/**
 * Measure one key. Every *exit* failure — a dead exit, a timeout — retires that
 * candidate and the key is tried on the next one, because it says nothing about
 * the key. Only a panel answer *about the key* becomes a key verdict; a key that
 * never got one comes back `error` (unmeasured) instead of reading as broken.
 */
async function measure(rec, cursor) {
  const out = { at: nowIso(), key: rec.key, mintExit: null, exit: null, models: null, chat: null, verdict: null, triedExits: [], note: null };
  const mintExit = (rec.verify && rec.verify.mintExit) || (rec.verifyIndependent && rec.verifyIndependent.mintExit) || '';
  out.mintExit = mintExit || null;

  let lastError = null;
  let pin = cursor.take();
  while (pin) {
    out.triedExits.push(pin.line);
    if (out.triedExits.length > MAX_EXITS) break;
    let models;
    try {
      models = await panelOn(pin).models(rec.key, { tries: 1, timeoutMs: 30000 });
    } catch (e) {
      log(`#${rec.index} ${rec.key.slice(0, 10)}… exit failed (${String(e.message).slice(0, 80)}) — trying the next exit`);
      cursor.died(pin.line);
      lastError = e;
      pin = cursor.take();
      continue;
    }

    if (models.status !== 200) {
      // The panel answered the key itself: that is a key verdict, not an exit one.
      cursor.answered(pin);
      out.exit = pin.line;
      out.models = { status: models.status, body: String(models.text || '').slice(0, 300), exit: pin.line };
      out.verdict = classify(models, null);
      log(`#${rec.index} ${rec.key.slice(0, 10)}… /v1/models ${models.status} · ${out.models.body.slice(0, 140)}`);
      return out;
    }

    // ---- authentic: this exit answered the key. Now ask what it can spend.
    const ids = models.json && Array.isArray(models.json.data) ? models.json.data.map((m) => m.id || m) : [];
    cursor.answered(pin);
    out.exit = pin.line;
    out.models = { status: 200, count: ids.length || null, exit: pin.line };
    if (ids.length) writeJson(MODELS_FILE, { at: nowIso(), base: BASE_URL, models: ids });

    let tryList = MODELS.slice();
    if (!tryList.length) tryList = rankCheapest(ids.filter((id) => !CHATTY.test(id))).slice(0, 5);

    for (const id of tryList) {
      let res = null;
      for (;;) {
        try {
          res = await panelOn(pin).chat(rec.key, id, { tries: 1, timeoutMs: 90000, maxTokens: MAX_TOKENS });
          break;
        } catch (e) {
          if (isExitError(e)) {
            log(`#${rec.index} ${rec.key.slice(0, 10)}… exit failed mid-check (${String(e.message).slice(0, 60)}) — trying the next exit`);
            cursor.died(pin.line);
          } else {
            res = { status: 0, text: String(e.message).slice(0, 200), exit: pin.line };
            break;
          }
          const next = cursor.take();
          if (!next) {
            res = { status: 0, text: 'no candidate exit left (dead or skipped)', exit: pin.line };
            break;
          }
          out.triedExits.push(next.line);
          pin = next;
        }
      }
      out.chat = { model: id, status: res.status, text: String(res.text || '').slice(0, 300), exit: res.exit };
      log(`#${rec.index} chat ${id} → ${res.status} ${String(res.text || '').slice(0, 140)}`);
      if (res.status === 200 || looksQuota(res.text)) break;
    }

    out.exit = pin.line;
    out.verdict = classify({ status: 200 }, out.chat);
    if (out.verdict === 'ok') {
      if (!fs.existsSync(KEYS) || !fs.readFileSync(KEYS, 'utf8').includes(rec.key)) appendLine(KEYS, rec.key);
    }
    log(
      `#${rec.index} ${rec.key.slice(0, 10)}… models=200 chat=${out.chat ? out.chat.status : 'n/a'} → ${out.verdict} (exit ${pin.line}${mintExit ? `, mint exit ${mintExit}` : ''})`
    );
    return out;
  }

  out.verdict = 'error';
  out.note = `no candidate exit answered (${String((lastError && lastError.message) || 'no exits left').slice(0, 160)}) — the key was not measured`;
  log(`#${rec.index} ${rec.key.slice(0, 10)}… unmeasured: no exit answered — ${String((lastError && lastError.message) || 'no exits left').slice(0, 100)}`);
  return out;
}

(async () => {
  const accounts = readJson(ACCOUNTS, []);
  let todo = accounts.filter((r) => r.key);
  if (!todo.length && fs.existsSync(KEYS)) {
    // no account records on disk (only keys.txt): measure the file's lines as
    // synthetic records, so a clone with its own keys.txt still gets an answer
    todo = fs
      .readFileSync(KEYS, 'utf8')
      .split(/\r?\n/)
      .map((l) => l.split(/\s+#/)[0].trim())
      .filter(Boolean)
      .map((key, i) => ({ provider: 'liangjiewis', base: BASE_URL, index: i + 1, key, synthetic: true }));
  }
  if (ONLY_KEY) todo = todo.filter((r) => r.key === ONLY_KEY);
  if (!ALL && !ONLY_KEY) todo = todo.filter((r) => !(r.verifyIndependent && r.verifyIndependent.verdict === 'ok'));
  if (!todo.length) {
    log('no keys to verify for liangjiewis' + (ONLY_KEY ? ' (that key is not on disk)' : '') + ' — pass --all to re-check keys that already passed');
    return;
  }

  // ---- exits: the user's pool, screened for this host, proven list first
  const candidates = loadExits([pool], { shuffle: true });
  if (!candidates.length) {
    log(`no exits parsed from ${path.basename(pool)} — one per line, e.g. socks5://127.0.0.1:1080`);
    return;
  }
  const { good, tried } = await screen(candidates, { want: WANT, conc: Math.min(4, WANT), budgetMs: 240000 });
  if (!good.length) {
    log(`no usable exit for ${HOST} (${tried.length} tried) — no key was measured, ${todo.length} key(s) left untouched`);
    return;
  }
  try {
    const file = path.join(OUT, `screened-${HOST}.txt`);
    const known = new Set();
    if (fs.existsSync(file)) for (const l of fs.readFileSync(file, 'utf8').split('\n')) if (l.trim()) known.add(l.split('#')[0].trim());
    const fresh = good.filter((p) => !known.has(p.line));
    if (fresh.length) fs.appendFileSync(file, fresh.map((p) => `${p.line}  # verified ${nowIso()}`).join('\n') + '\n');
    if (fresh.length) log(`· screened exits → out/screened-${HOST}.txt (+${fresh.length} of ${good.length} proven)`);
  } catch (e) {
    log(`· screened list write failed: ${String(e.message).slice(0, 120)}`);
  }

  log(`verify ${todo.length} key(s) for liangjiewis (${BASE_URL}) · exits ${good.length} proven of ${tried.length} tried · want ${WANT}`);

  const cursor = new ExitCursor(good, { avoid: todo.map((r) => (r.verify && r.verify.mintExit) || (r.verifyIndependent && r.verifyIndependent.mintExit)).filter(Boolean) });
  const results = [];
  for (const rec of todo) {
    try {
      results.push(await measure(rec, cursor));
    } catch (e) {
      results.push({ at: nowIso(), key: rec.key, verdict: 'error', note: String(e.message).slice(0, 200) });
      log(`#${rec.index} verify error: ${String(e.message).slice(0, 160)}`);
    }
    const r = results[results.length - 1];
    if (rec.synthetic) continue; // nothing to persist for a keys.txt-only record
    rec.verifyIndependent = r;
    // The current verdict also lands where the exit verdicts already live, so a
    // reader of `accounts.json` sees one shape: `verify.status` (the HTTP status
    // when a key authenticated, otherwise the verdict), `verify.verdict`,
    // `verify.exit` (the exit that observed it) and `verify.at`. The mint-time
    // measurement is kept, not overwritten: it moves to `verify.atMint`.
    const refused = r.verdict === 'account_banned' || r.verdict === 'key_refused';
    const prev = rec.verify && !rec.verify.atMint ? { ...rec.verify } : (rec.verify && rec.verify.atMint) || null;
    rec.verify = {
      status: refused ? r.verdict : (r.models && r.models.status) || r.verdict,
      verdict: r.verdict,
      exit: r.exit || (r.models && r.models.exit) || null,
      at: r.at,
      ...(r.models && r.models.body ? { body: r.models.body } : {}),
      ...(r.chat ? { chat: { model: r.chat.model, status: r.chat.status, exit: r.chat.exit } } : {}),
      ...(prev ? { atMint: prev } : {}),
    };
  }
  if (accounts.length) writeJson(ACCOUNTS, accounts);

  const ok = results.filter((r) => r.models && r.models.status === 200).length;
  const spendable = results.filter((r) => r.verdict === 'ok').length;
  const authentic = results.filter((r) => r.verdict === 'authentic').length;
  const quota = results.filter((r) => r.verdict === 'quota').length;
  const accountBanned = results.filter((r) => r.verdict === 'account_banned').length;
  const refused = results.filter((r) => r.verdict === 'key_refused').length;
  const unmeasured = results.filter((r) => r.verdict === 'error').length;
  const parts = [`${ok}/${results.length} keys answered /v1/models 200`];
  if (spendable) parts.push(`${spendable} spendable`);
  if (authentic) parts.push(`${authentic} authentic, no completion channel answered`);
  if (quota) parts.push(`${quota} out of credit`);
  if (accountBanned) parts.push(`${accountBanned} account(s) banned by the panel (auth.user_banned)`);
  if (refused) parts.push(`${refused} key(s) refused`);
  if (unmeasured) parts.push(`${unmeasured} unmeasured`);
  const tail = unmeasured ? ' — re-run to measure them (an exit problem is not a key verdict)' : '';
  log(`done: liangjiewis — ${parts.join(' · ')}${tail}`);
})().catch((e) => {
  log(`FATAL ${e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e}`);
  process.exit(1);
});
