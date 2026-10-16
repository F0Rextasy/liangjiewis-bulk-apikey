#!/usr/bin/env node
'use strict';

/**
 * Command dispatcher for liangjiewis-bulk-apikey.
 *
 *   node cli.js mint     create fresh accounts and mint one key each
 *   node cli.js verify   re-check keys that are already on disk
 *   node cli.js help
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
  console.log('usage: node cli.js <task> [options]\n');
  console.log('tasks:');
  for (const [name, t] of Object.entries(TASKS)) console.log('  ' + name.padEnd(9) + ' ' + t.note);
  console.log('\noptions: every task takes its own flags — ask it directly:');
  console.log('  node <task-file> --help');
  console.log('  --connect-9router    register the keys in keys.txt with 9Router after the task');
  console.log('\nproxy pool:');
  console.log('  one exit per line in proxies.txt — scheme://host:port[#comment], user:pass@ supported');
  console.log('\nno options? run the interactive launcher:  node launcher.js');
}

const args = process.argv.slice(2);
const connect = args.includes('--connect-9router');
// the flag belongs to the dispatcher — the tasks reject flags they do not know,
// so it never reaches them (and it can sit before the task without hiding it)
const argv = args.filter((a) => a !== '--connect-9router');
const task = argv[0];
if (!task || task === 'help' || task === '--help' || task === '-h') {
  help();
  process.exit(0);
}
const entry = TASKS[task];
if (!entry) {
  console.error('unknown task: ' + task + '\n');
  help();
  process.exit(1);
}
const child = spawnSync(process.execPath, [path.join(__dirname, entry.file), ...argv.slice(1)], {
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
