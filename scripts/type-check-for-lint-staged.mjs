#!/usr/bin/env node

/**
 * Type check script for lint-staged
 * This script ignores file arguments passed by lint-staged and runs type-check on the entire project
 */

import { spawnSync } from 'child_process';

const result = spawnSync('pnpm', ['run', 'type-check'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(result.status ?? 1);
