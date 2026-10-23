#!/usr/bin/env node
'use strict';

/**
 * liangjiewis-bulk-apikey · mint
 *
 * One 量界智算 account per key. The flow — read the panel's gates, send the
 * verification mail, read the code out of a fresh mailbox, register, log in,
 * ask for the daily check-in, create the key, then verify it live — lives in the
 * engine that ships next to this file. This entry pins the provider's settings
 * and points the two engine lookups that belong to a provider *folder* (its
 * temp-mail module and the folder `keys.txt` lives in) at this repository.
 *
 *   node src/mint.js                          # 3 keys, exits from proxies.txt
 *   node src/mint.js --count 10               # any number; accounts run one after another
 *   node src/mint.js --count 10 --scan-conc 8 # exits probed eight at a time
 *
 * A key is appended to `keys.txt` only after `GET /v1/models` answered 200 for it
 * and a model call came back (a completion, or a credit refusal — that is what a
 * fresh account answers here); per-account detail (mailbox, steps, check-in,
 * verify result) lands in `accounts.json`, and every run's log in `out/`.
 */

const fs = require('fs');
const path = require('path');

const BASE = 'https://liangjiewis.com';
const TAG = 'ljw';
const ROOT = path.resolve(__dirname, '..'); // the checkout root: user-facing files (proxies.txt, keys.txt, out/…) live here
const POOL = path.join(ROOT, 'proxies.txt');
const DEFAULTS = { count: '3', 'poll-ms': '2000', 'code-wait': '300000', 'max-cycle': '3', scan: '200', 'scan-conc': '8', budget: '2400' };
// The panel's verification mail has exactly one sender, and a shared mailbox is
// full of other people's codes: a code is only submitted when the mail it came
// from matches `SENDER` below, otherwise the panel answers `验证码错误或已过期`.
// `--sender` overrides it; an empty `--sender` accepts any mail.
const SENDER = '1449683658|量界智算';

const USAGE = `liangjiewis-bulk-apikey · mint — one 量界智算 account per key

usage: node src/mint.js [options]

  --count N        keys to mint (default 3)
  --pool FILE      exit list, one per line (default proxies.txt), optional
  --mail MODE      emailnator (default) | imap  — imap needs --imap-user/--imap-pass
  --imap-user U    mailbox account for --mail imap (or IMAP_USER)
  --imap-pass P    mailbox password for --mail imap (or IMAP_PASS)
  --mail-address A address template for --mail imap mode
  --sender REGEX   sender the verification mail must match (default: the panel's own);
                   \`--sender none\` accepts mail from any sender
  --model ID       completion to probe with after the mint (default: cheapest listed)
  --scan N         exit candidates probed per pinned exit (default 200)
  --scan-conc N    exits probed in parallel, max 8 (default 8)
  --poll-ms N      mailbox poll cadence (default 2000)
  --code-wait N    how long to wait for the verification mail (default 300000)
  --max-cycle N    cycles per account — a dead exit is retried on a fresh one (default 3)
  --budget N       wall-clock ceiling in seconds for the whole run (default 2400)
  --base URL       panel address (default ${BASE})
  --preset NAME    turbo (5 accounts at a time, 3 s apart) | balanced (4/6) | safe (2/8)
  --conc N         accounts minted at a time (explicit flag wins over --preset)
  --gap S          seconds between account starts inside a worker
  --help           this text

One exit is pinned per account when a pool is provided, and a mailbox that cannot
be reached through it is retried on the next line.

Requests go through your proxy list when one is provided (--pool / env). Without
a pool the tool connects directly.`;

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

const FLAGS = ['--count', '--pool', '--mail', '--imap-user', '--imap-pass', '--mail-address', '--base', '--model', '--sender', '--preset', '--conc', '--gap', '--poll-ms', '--code-wait', '--max-cycle', '--scan', '--scan-conc', '--budget', '--auto'];
for (const a of argv) {
  // `--preset=turbo` (and the same form for --conc/--gap) is accepted too.
  if (a.startsWith('-') && !FLAGS.includes(a) && !['--preset', '--conc', '--gap'].includes(a.split('=')[0])) {
    console.error(`unknown flag: ${a}\n`);
    console.log(USAGE);
    process.exit(2);
  }
}

const count = parseInt(one('count') || DEFAULTS.count, 10);
if (!Number.isFinite(count) || count < 1) {
  console.error('--count takes a positive integer');
  process.exit(2);
}
const pool = path.resolve(ROOT, one('pool') || POOL);
const exits = (() => {
  try {
    return fs.readFileSync(pool, 'utf8').split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#'));
  } catch (e) {
    return [];
  }
})();
if (!exits.length) {
  // No pool = DIRECT mode: a proxy is recommended at scale (per-IP limits,
  // bans), but the tool works without one. `null` is the direct sentinel the
  // engine's loader hands to the request layer.
  console.log(`no proxy list at ${pool} — running WITHOUT a proxy (direct). Put exits there (or pass --pool) to rotate per account.`);
}

// ---- the engine's two provider-folder lookups, pointed at this repository ---
//
// 1) keys.txt, accounts.json, models.json and out/ live at the checkout root (the
//    code sits in src/), so the engine's "provider folder" is this repository root.
const lib = require('./lib.js');
lib.providerDir = () => {
  fs.mkdirSync(path.join(ROOT, 'out'), { recursive: true });
  return ROOT;
};

// 2) the engine reads its temp-mail module from the `cloudflare-wai/` provider
//    folder, which does not exist here. The same module ships beside this file
//    as `emailnator.js`, so that one lookup is resolved locally.
const Module = require('module');
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (/cloudflare-wai[\\/]emailnator/.test(String(request))) return path.join(__dirname, 'emailnator.js');
  return resolveFilename.call(this, request, ...rest);
};

// ---- hand the engine its settings (first occurrence of a flag wins) ---------
// The measured sender is the default; `--sender none` drops the restriction and
// accepts whatever lands in the mailbox first.
const senderArg = one('sender');
const sender = senderArg === null ? SENDER : /^none$/i.test(senderArg) ? '' : senderArg;

const passthrough = ['--mail', '--imap-user', '--imap-pass', '--mail-address', '--model', '--preset', '--conc', '--gap', '--poll-ms', '--code-wait', '--max-cycle', '--scan', '--scan-conc', '--budget'];
const forwarded = [];
for (const flag of passthrough) {
  const v = one(flag);
  if (v) forwarded.push(flag, v);
}

const { presetArgv, resolvePreset } = require('./preset');
// Run shape (operator standard v3): `--preset` picks workers + pace, an explicit
// --conc/--gap wins, and with neither the engine keeps its serial default. Both
// `--preset turbo` and `--preset=turbo` are accepted for these three flags.
const eq = (n) => {
  const h = argv.find((a) => a.startsWith(`--${n}=`));
  return h ? h.slice(n.length + 3) : null;
};
const shapeArg = (n) => (one(n) != null ? one(n) : eq(n));
const PRESET = presetArgv(argv) || shapeArg('preset');
const SHAPE = resolvePreset({
  preset: PRESET,
  conc: shapeArg('conc') ? parseInt(shapeArg('conc'), 10) : null,
  gap: shapeArg('gap') ? parseInt(shapeArg('gap'), 10) : null,
  defaultConc: 1,
  defaultGap: 0,
});
const shapeArgv = [];
if (PRESET) shapeArgv.push('--preset', PRESET);
shapeArgv.push('--conc', String(SHAPE.conc));
if (SHAPE.gap) shapeArgv.push('--gap', String(SHAPE.gap));

process.argv = [
  process.argv[0],
  path.join(__dirname, 'mint-newapi-pinned.js'),
  '--name',
  'liangjiewis',
  '--base',
  one('base') || BASE,
  '--tag',
  TAG,
  '--mail',
  one('mail') || 'emailnator',
  '--pool',
  pool,
  '--mail-pool',
  pool,
  ...(sender ? ['--sender', sender] : []),
  '--count',
  String(count),
  ...shapeArgv,
  ...Object.entries(DEFAULTS)
    .filter(([k]) => k !== 'count' && !forwarded.includes(`--${k}`))
    .flatMap(([k, v]) => [`--${k}`, v]),
  ...forwarded,
];

console.log(`liangjiewis · ${count} key(s) · ${SHAPE.name ? `${SHAPE.name} (conc ${SHAPE.conc}${SHAPE.gap ? `, gap ${SHAPE.gap}s` : ''})` : `conc ${SHAPE.conc}`} · exits ${exits.length || 'direct'}${exits.length ? ` from ${path.basename(pool)}` : ''} · keys land in keys.txt`);
require(path.join(__dirname, 'mint-newapi-pinned.js'));
