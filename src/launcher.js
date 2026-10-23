#!/usr/bin/env node
'use strict';

/**
 * Interactive launcher for liangjiewis-bulk-apikey — a menu over the task modules.
 * Settings persist in launcher.config.json at the checkout root.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawnSync } = require('child_process');

const HERE = __dirname; // the src/ folder — the task modules spawn from here
const ROOT = path.resolve(__dirname, '..'); // the checkout root: user-facing files live here
const CONFIG = path.join(ROOT, 'launcher.config.json');
const POOL = path.join(ROOT, 'proxies.txt');
const KEYS = path.join(ROOT, 'keys.txt');

const defaults = { count: 3, conc: 8 };
let cfg = { ...defaults };
try { Object.assign(cfg, JSON.parse(fs.readFileSync(CONFIG, 'utf8'))); } catch (e) {}
const save = () => fs.writeFileSync(CONFIG, JSON.stringify(cfg, null, 2) + '\n');
// kept in sync with args.json — mint reads --count / --scan-conc, verify is flagless
const ARGS = {"mint":["--count","count","--scan-conc","conc"],"verify":[]};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q, fb) => new Promise((r) => rl.question(q + (fb !== undefined ? ' [' + fb + ']' : '') + ': ', (a) => r(String(a).trim() || fb)));

const LOGO = String.raw`
██╗     ██╗ █████╗ ███╗   ██╗ ██████╗      ██╗██╗███████╗██╗    ██╗██╗███████╗
██║     ██║██╔══██╗████╗  ██║██╔════╝      ██║██║██╔════╝██║    ██║██║██╔════╝
██║     ██║███████║██╔██╗ ██║██║  ███╗     ██║██║█████╗  ██║ █╗ ██║██║███████╗
██║     ██║██╔══██║██║╚██╗██║██║   ██║██   ██║██║██╔══╝  ██║███╗██║██║╚════██║
███████╗██║██║  ██║██║ ╚████║╚██████╔╝╚█████╔╝██║███████╗╚███╔███╔╝██║███████║
╚══════╝╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚════╝ ╚═╝╚══════╝ ╚══╝╚══╝ ╚═╝╚══════╝`;

function banner() {
  const lines = [
    'liangjiewis-bulk-apikey  ·  one 量界智算 account per key',
    '97 models listed · keys verified live; inference needs an account top-up',
    'open source · MIT · liangjiewis-bulk-apikey contributors',
  ];
  // CJK glyphs are two terminal columns wide, so the box is padded by display
  // width, not by string length (a 4-char name is 8 columns)
  const dw = (s) => [...s].reduce((n, c) => n + (/[\u1100-\u115F\u2E80-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFF60\uFFE0-\uFFE6]/.test(c) ? 2 : 1), 0);
  const w = Math.max(...lines.map(dw));
  console.log(LOGO);
  console.log('  ┌' + '─'.repeat(w + 2) + '┐');
  for (const line of lines) console.log('  │ ' + line + ' '.repeat(w - dw(line)) + ' │');
  console.log('  └' + '─'.repeat(w + 2) + '┘\n');
}

const count = (f) => { try { return fs.readFileSync(f, 'utf8').split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#')).length; } catch (e) { return 0; } };

function run(args) {
  console.log('\n▶ node src/' + args.join(' ') + '\n');
  const r = spawnSync(process.execPath, args, { windowsHide: true, cwd: HERE, stdio: 'inherit' });
  if (r.status !== 0) console.log('\n⚠ exited with code ' + r.status);
}

function argsFor(task) {
  const spec = ARGS[task] || [];
  return spec.map((v) => (v === 'count' ? String(cfg.count) : v === 'conc' ? String(cfg.conc) : v));
}

async function settings() {
  console.log('\nSettings');
  console.log('  1) count      ' + cfg.count + '   (keys to mint per run)');
  console.log('  2) conc       ' + cfg.conc + '   (exits probed in parallel per pin, max 8)');
  console.log('  0) back');
  const p = await ask('choose', '0');
  if (p === '1') cfg.count = parseInt(await ask('count', cfg.count), 10) || cfg.count;
  if (p === '2') cfg.conc = parseInt(await ask('parallel exits', cfg.conc), 10) || cfg.conc;
  save();
}

async function nineRouter() {
  const { connectKeysFile, connect9Router } = require('./connect-9router.js');
  cfg.routerBase = await ask('9Router base URL', cfg.routerBase || 'http://localhost:20128');
  cfg.routerPassword = await ask('9Router password', cfg.routerPassword || '123456');
  save();
  console.log('');
  try {
    await connectKeysFile({ base: cfg.routerBase, password: cfg.routerPassword });
  } catch (e) {
    if (!/no API keys/.test(e.message)) throw e;
    console.log('\n⚠ ' + e.message);
    const apiKey = await ask('API key to register');
    if (apiKey) await connect9Router({ base: cfg.routerBase, password: cfg.routerPassword, apiKey });
  }
}

async function omniRouter() {
  const { connectKeysFile, connectOmniRoute } = require('./connect-omniroute.js');
  cfg.routerBase = await ask('OmniRoute base URL', cfg.routerBase || 'http://localhost:20128');
  cfg.routerPassword = await ask('OmniRoute password', cfg.routerPassword || '123456');
  save();
  console.log('');
  try {
    await connectKeysFile({ base: cfg.routerBase, password: cfg.routerPassword });
  } catch (e) {
    if (!/no API keys/.test(e.message)) throw e;
    console.log('\n⚠ ' + e.message);
    const apiKey = await ask('API key to register');
    if (apiKey) await connectOmniRoute({ base: cfg.routerBase, password: cfg.routerPassword, apiKey });
  }
}

async function main() {
  if (process.argv.includes('--connect-omniroute')) {
    await omniRouter();
    rl.close();
    return;
  }

  process.stdout.write('\x1b[2J\x1b[H');
  banner();
  console.log('  proxy exits: ' + (count(POOL) || 'none — running WITHOUT a proxy (direct)') + '     keys on disk: ' + count(KEYS) + '\n');
  console.log('  1) mint      create fresh accounts and mint one key each');
  console.log('  2) verify    re-check keys that are already on disk');
  console.log('  3) Settings');
  console.log('  6) Connect to 9Router   register the keys in keys.txt with a local 9Router');
  console.log('  7) Connect to OmniRoute   register the keys in keys.txt with a local OmniRoute');
  console.log('  0) Exit\n');
  const choice = await ask('choose', '1');
  if (choice === '1') {
    run(['mint.js', ...argsFor('mint')]);
  }
  else if (choice === '2') {
    run(['verify.js', ...argsFor('verify')]);
  }
  else if (choice === '3') {
    await settings();
  }
  else if (choice === '6') {
    await nineRouter();
  }
  else if (choice === '7') {
    await omniRouter();
  } else {
    rl.close();
    return;
  }
  await ask('\npress enter for the menu', '');
  return main();
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Interactive launcher: run `node src/launcher.js` and pick a menu item.');
  process.exit(0);
}

main().catch((e) => { console.error('launcher failed:', e.stack || e.message); process.exit(1); });
