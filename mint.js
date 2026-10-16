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
 *   node mint.js                          # 3 keys, exits from proxies.txt
 *   node mint.js --count 10               # any number; accounts run one after another
 *   node mint.js --count 10 --scan-conc 8 # exits probed eight at a time
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
const POOL = path.join(__dirname, 'proxies.txt');
const DEFAULTS = { count: '3', 'poll-ms': '2000', 'code-wait': '300000', 'max-cycle': '3', scan: '200', 'scan-conc': '8', budget: '2400' };
// The panel's verification mail has exactly one sender, and a shared mailbox is
// full of other people's codes: a code is only submitted when the mail it came
// from matches `SENDER` below, otherwise the panel answers `验证码错误或已过期`.
// `--sender` overrides it; an empty `--sender` accepts any mail.
const SENDER = '1449683658|量界智算';

const USAGE = `liangjiewis-bulk-apikey · mint — one 量界智算 account per key

usage: node mint.js [options]

  --count N        keys to mint (default 3)
  --pool FILE      exit list, one per line (default proxies.txt)
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
  --help           this text

Every request rides an exit from --pool, one exit pinned per account; a mailbox
that cannot be reached through it is retried on the next line.`;

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

const FLAGS = ['--count', '--pool', '--mail', '--imap-user', '--imap-pass', '--mail-address', '--base', '--model', '--sender', '--poll-ms', '--code-wait', '--max-cycle', '--scan', '--scan-conc', '--budget'];
for (const a of argv) {
  if (a.startsWith('-') && !FLAGS.includes(a)) {
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
const pool = path.resolve(one('pool') || POOL);
if (!fs.existsSync(pool)) {
  console.error(`no exit list at ${pool}\n  one exit per line, e.g. socks5://127.0.0.1:1080 — see README "Behind a proxy"`);
  process.exit(2);
}
const exits = fs.readFileSync(pool, 'utf8').split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#'));
if (!exits.length) {
  console.error(`${pool} has no exits in it yet (comment lines do not count)`);
  process.exit(2);
}

// ---- the engine's two provider-folder lookups, pointed at this repository ---
//
// 1) keys.txt, accounts.json, models.json and out/ live next to these tools, so
//    the engine's "provider folder" is this repository root.
const lib = require('./lib.js');
lib.providerDir = () => {
  fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
  return __dirname;
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

const passthrough = ['--mail', '--imap-user', '--imap-pass', '--mail-address', '--model', '--poll-ms', '--code-wait', '--max-cycle', '--scan', '--scan-conc', '--budget'];
const forwarded = [];
for (const flag of passthrough) {
  const v = one(flag);
  if (v) forwarded.push(flag, v);
}

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
  ...Object.entries(DEFAULTS)
    .filter(([k]) => k !== 'count' && !forwarded.includes(`--${k}`))
    .flatMap(([k, v]) => [`--${k}`, v]),
  ...forwarded,
];

console.log(`liangjiewis · ${count} key(s) · exits ${exits.length} from ${path.basename(pool)} · keys land in keys.txt`);
require(path.join(__dirname, 'mint-newapi-pinned.js'));
