// Production start script for the API server
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const apiPath = join(__dirname, 'api.js');

console.log('🚀 Starting EMINGO AI Dashboard API Server...');
console.log('📂 API Path:', apiPath);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔌 Port:', process.env.PORT || 3001);

const server = spawn('node', [apiPath], {
  stdio: 'inherit',
  env: process.env
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`🛑 Server exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('📡 SIGTERM received, shutting down gracefully...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('📡 SIGINT received, shutting down gracefully...');
  server.kill('SIGINT');
});
