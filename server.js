import { spawn } from 'node:child_process';
import net from 'node:net';

const root = process.cwd();
const isWindows = process.platform === 'win32';
const npxCommand = isWindows ? 'npx.cmd' : 'npx';

function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const tester = net.createServer();

    tester.once('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        resolve(findAvailablePort(startPort + 1));
        return;
      }

      reject(error);
    });

    tester.once('listening', () => {
      tester.close(() => resolve(startPort));
    });

    tester.listen(startPort, '0.0.0.0');
  });
}

const port = await findAvailablePort(3001);
process.env.VITE_API_URL = `http://localhost:${port}`;

const createProcess = (command, args) => spawn(command, args, {
  cwd: root,
  stdio: 'inherit',
  shell: false,
  env: {
    ...process.env,
    VITE_API_URL: process.env.VITE_API_URL,
  },
});

const vite = createProcess(isWindows ? 'cmd.exe' : npxCommand, isWindows ? ['/c', npxCommand, 'vite'] : ['vite']);
const jsonServer = createProcess(isWindows ? 'cmd.exe' : npxCommand, isWindows ? ['/c', npxCommand, 'json-server', '--watch', 'Json/db.json', '--port', String(port)] : ['json-server', '--watch', 'Json/db.json', '--port', String(port)]);

const stopAll = () => {
  vite.kill('SIGINT');
  jsonServer.kill('SIGINT');
};

vite.on('exit', (code, signal) => {
  if (signal) {
    stopAll();
    process.exit(0);
    return;
  }

  if (code && code !== 0) {
    process.exit(code);
  }
});

jsonServer.on('exit', (code, signal) => {
  if (signal) {
    stopAll();
    process.exit(0);
    return;
  }

  if (code && code !== 0) {
    process.exit(code);
  }
});

process.on('SIGINT', () => {
  stopAll();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopAll();
  process.exit(0);
});
