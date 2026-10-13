import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Annotated AI Full-Stack Platform...');

// 1. Start Backend Server (Express + PostgreSQL on port 5000)
const serverProcess = spawn('node', ['server/server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

serverProcess.on('error', (err) => {
  console.error('❌ Failed to start Backend Server:', err);
});

// 2. Start Next.js Frontend (Port 3000)
const nextProcess = spawn('npx', ['next', 'dev', '-p', '3000'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

nextProcess.on('error', (err) => {
  console.error('❌ Failed to start Next.js Dev Server:', err);
});

// Handle graceful shutdown
const shutdown = () => {
  console.log('\n🛑 Shutting down servers...');
  serverProcess.kill();
  nextProcess.kill();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
