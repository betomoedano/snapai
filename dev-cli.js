#!/usr/bin/env node

// Development CLI wrapper that allows passing commands
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get command line arguments (skip 'node' and script name)
const args = process.argv.slice(2);

// Path to the dev binary
const devBin = join(__dirname, 'bin', 'dev.js');

// Spawn the dev binary with the provided arguments
const child = spawn('node', [devBin, ...args], {
  stdio: 'inherit',
  cwd: __dirname
});

child.on('error', (error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});

child.on('close', (code) => {
  process.exit(code);
});