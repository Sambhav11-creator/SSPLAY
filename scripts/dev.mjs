/**
 * Run SSPLAY frontend + Python backend together.
 * Usage: npm run dev   (from project root)
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const isWin = process.platform === 'win32';

const pythonCandidates = [
  path.join(root, 'server', 'venv', isWin ? 'Scripts' : 'bin', isWin ? 'python.exe' : 'python'),
  isWin ? 'python' : 'python3',
];

const python = pythonCandidates.find((p) => p === 'python' || p === 'python3' || fs.existsSync(p));
if (!python) {
  console.error('Python not found. Create venv: cd server && python -m venv venv && pip install -r requirements.txt');
  process.exit(1);
}

const npmCmd = isWin ? 'npm.cmd' : 'npm';

const server = spawn(python, ['run.py'], {
  cwd: path.join(root, 'server'),
  stdio: 'inherit',
  shell: isWin,
  env: { ...process.env, PYTHONUNBUFFERED: '1' },
});

const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(root, 'client'),
  stdio: 'inherit',
  shell: isWin,
});

let stopping = false;

const shutdown = (code = 0) => {
  if (stopping) return;
  stopping = true;
  server.kill('SIGTERM');
  client.kill('SIGTERM');
  setTimeout(() => process.exit(code), 300);
};

server.on('error', (err) => {
  console.error('[server]', err.message);
  shutdown(1);
});

client.on('error', (err) => {
  console.error('[client]', err.message);
  shutdown(1);
});

server.on('exit', (code) => {
  if (!stopping && code !== 0 && code !== null) shutdown(code);
});

client.on('exit', (code) => {
  if (!stopping && code !== 0 && code !== null) shutdown(code);
});

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

console.log('\n  SSPLAY dev\n  API:  http://localhost:5000/api/health\n  App:  http://localhost:5173\n');
