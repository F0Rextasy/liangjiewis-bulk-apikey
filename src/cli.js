#!/usr/bin/env node
'use strict';

/**
 * Command dispatcher for liangjiewis-bulk-apikey.
 *
 *   node src/cli.js mint     create fresh accounts and mint one key each
 *   node src/cli.js verify   re-check keys that are already on disk
 *   node src/cli.js help
 *
 * Every task spawns the matching module in this folder, so a crash in one run
 * never leaves state behind in this process.
 *
 * `--connect-9router` adds one step after the task: every key in keys.txt is
 * registered with a 9Router instance (http://localhost:20128 by default).
 */

const path = require('path');
const { spawnSync } = require('child_process');

const TASKS = {
  mint: { file: 'mint.js', note: 'create fresh accounts and mint one key each' },
  verify: { file: 'verify.js', note: 're-check keys that are already on disk' },
};

function help() {
  console.log('liangjiewis-bulk-apikey — One 量界智算 account per API key — 97 models listed, email-verified sign-up, every key live-checked\n');
  console.log('usage: node src/cli.js <task> [options]\n');
  console.log('one command (captcha step automatic — nothing to answer):');
  console.log('  node src/cli.js mint --count N        mint N accounts, one key each\n');
  console.log('tasks:');
  for (const [name, t] of Object.entries(TASKS)) console.log('  ' + name.padEnd(9) + ' ' + t.note);
  console.log('\noptions: every task takes its own flags — ask it directly:');
  console.log('  node src/<task-file> --help');
  console.log('  --count N            accounts (= keys) to mint or re-check');
  console.log('  --connect-9router    register the keys in keys.txt with 9Router after the task');
  console.log('\nkeys: keys.txt holds only live-checked keys; a key the panel refuses in a verify');
  console.log('      run leaves keys.txt and is parked in keys-dead.txt');
  console.log('\nproxy pool:');
  console.log('  one exit per line in proxies.txt — scheme://host:port[#comment], user:pass@ supported');
  console.log('\nno options? run the interactive launcher:  node src/launcher.js');
}

const args = process.argv.slice(2);
const connect = args.includes('--connect-9router');
// `--connect-9router` and `--auto` belong to the dispatcher — the tasks reject
// flags they do not know, so neither ever reaches them. `--auto` is the
// non-interactive marker `npm run mint` / the launcher passes; on its own it
// means `mint` (the captcha step is automatic either way).
const auto = args.includes('--auto');
const argv = args.filter((a) => a !== '--connect-9router' && a !== '--auto');
const named = argv[0] && !argv[0].startsWith('-') ? argv[0] : null;
const task = named || (auto || argv.length ? 'mint' : argv[0]);
if (!task || task === 'help' || task === '--help' || task === '-h' || argv.includes('--help') || argv.includes('-h')) {
  help();
  process.exit(0);
}
const entry = TASKS[task];
if (!entry) {
  console.error('unknown task: ' + task + '\n');
  help();
  process.exit(1);
}
const child = spawnSync(process.execPath, [path.join(__dirname, entry.file), ...(named ? argv.slice(1) : argv)], {
  windowsHide: true,
  stdio: 'inherit',
  env: process.env,
});
const status = child.status === null ? 1 : child.status;
if (!connect) process.exit(status);
const { connectKeysFile, parseRouterArgs } = require('./connect-9router.js');
connectKeysFile(parseRouterArgs(args))
  .then(() => {
    process.exitCode = status;
  })
  .catch((e) => {
    console.error('[9router] ' + e.message);
    process.exitCode = 1;
  });
