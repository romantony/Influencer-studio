#!/usr/bin/env node
import { spawn } from 'node:child_process';

const [mode = 'dev', ...rest] = process.argv.slice(2);
const allowed = new Set(['dev', 'deploy', 'codegen']);

if (!allowed.has(mode)) {
  console.error(`Unknown Convex command "${mode}". Use one of: ${[...allowed].join(', ')}`);
  process.exit(1);
}

const deployment = process.env.CONVEX_DEPLOYMENT ?? 'dev:beloved-pelican-210';
const pnpmArgs = ['--filter', '@influencerstudio/convex-schema', 'exec', 'convex', mode];

if (mode !== 'codegen' && deployment && !rest.includes('--deployment')) {
  pnpmArgs.push('--deployment', deployment);
}

pnpmArgs.push(...rest);

const child = spawn('pnpm', pnpmArgs, { stdio: 'inherit', env: process.env });
child.on('exit', code => {
  process.exit(code ?? 0);
});
