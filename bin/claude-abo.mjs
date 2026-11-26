#!/usr/bin/env node
// Dispatcher: `claude-abo <cmd> [<sub>] [...args]` loads src/commands/<cmd>.mjs
// (or src/commands/<cmd>/<sub>.mjs when <cmd> is a directory).
// `check` is built in: it runs every src/checks/*.mjs.
import { readdir, stat } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

// ABO_COMMANDS_DIR is a test hook so fixtures can stand in for src/commands.
const commandsDir = process.env.ABO_COMMANDS_DIR ?? fileURLToPath(new URL('../src/commands/', import.meta.url));
const checksDir = fileURLToPath(new URL('../src/checks/', import.meta.url));

async function listCommands() {
  let entries = [];
  try {
    entries = await readdir(commandsDir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .map((e) => (e.isDirectory() ? e.name + '/' : e.name.replace(/\.mjs$/, '')))
    .filter((n) => n && !n.startsWith('.'))
    .sort();
}

async function printHelp(out) {
  const names = ['check', ...(await listCommands())];
  out.write(`Usage: claude-abo <command> [args]\n\nCommands:\n${names.map((n) => `  ${n}`).join('\n')}\n`);
}

async function isFile(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

async function isDir(p) {
  try {
    return (await stat(p)).isDirectory();
  } catch {
    return false;
  }
}

function takeFlag(argv, name) {
  const i = argv.indexOf(name);
  if (i === -1) return null;
  const value = argv[i + 1];
  argv.splice(i, value === undefined ? 1 : 2);
  return value ?? true;
}

async function runChecks(argv) {
  const opts = { local: false, denylistFile: null };
  if (argv.includes('--local')) {
    opts.local = true;
    argv.splice(argv.indexOf('--local'), 1);
  }
  const file = takeFlag(argv, '--local-denylist');
  if (typeof file === 'string') opts.denylistFile = file;
  let files = [];
  try {
    files = (await readdir(checksDir)).filter((f) => f.endsWith('.mjs')).sort();
  } catch {
    files = [];
  }
  const findings = [];
  for (const f of files) {
    const mod = await import(pathToFileURL(path.join(checksDir, f)).href);
    const result = await mod.default(process.cwd(), opts);
    findings.push(...(result ?? []));
  }
  for (const f of findings) {
    process.stdout.write(`${f.severity} ${f.rule} ${f.file}:${f.line} ${f.message}\n`);
  }
  return findings.some((f) => f.severity === 'error') ? 1 : 0;
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  if (!cmd || cmd === '--help' || cmd === '-h' || cmd === 'help') {
    await printHelp(process.stdout);
    return cmd ? 0 : 2;
  }
  if (cmd === 'check') return runChecks(rest);
  if (/[\\/]|^\./.test(cmd)) {
    await printHelp(process.stdout);
    return 2;
  }
  const direct = path.join(commandsDir, `${cmd}.mjs`);
  let file = null;
  let args = rest;
  if (await isFile(direct)) {
    file = direct;
  } else if (await isDir(path.join(commandsDir, cmd))) {
    const sub = rest[0];
    if (sub && !/[\\/]|^\./.test(sub) && (await isFile(path.join(commandsDir, cmd, `${sub}.mjs`)))) {
      file = path.join(commandsDir, cmd, `${sub}.mjs`);
      args = rest.slice(1);
    }
  }
  if (!file) {
    await printHelp(process.stdout);
    return 2;
  }
  const mod = await import(pathToFileURL(file).href);
  return mod.default(args);
}

main().then(
  (code) => process.exit(code ?? 0),
  (err) => {
    process.stderr.write(`${err?.stack ?? err}\n`);
    process.exit(1);
  },
);
