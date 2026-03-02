#!/usr/bin/env node
/**
 * Setup script — run once after cloning/using this template.
 * Usage: node scripts/setup.mjs
 */

import { createInterface } from 'readline';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { execSync } from 'child_process';

const rl = createInterface({ input: process.stdin, output: process.stdout });

const ask = (question) =>
  new Promise((resolve) => rl.question(question, (answer) => resolve(answer.trim())));

// File extensions to process for text replacements
const TEXT_EXTENSIONS = new Set([
  '.json', '.js', '.mjs', '.cjs', '.ts', '.tsx', '.css', '.md',
  '.yml', '.yaml', '.env', '.sample', '.prettierrc', '.gitignore',
]);

// File/dir names to skip entirely
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', '.tanstack', 'pnpm-lock.yaml',
]);

function walkFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else {
      // Include files with recognised extensions OR no extension (e.g. Dockerfile)
      const ext = extname(entry.name);
      if (TEXT_EXTENSIONS.has(ext) || ext === '' || entry.name.startsWith('Dockerfile')) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

function replaceInFile(filePath, replacements) {
  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch {
    return; // skip unreadable files
  }

  let updated = content;
  for (const [from, to] of replacements) {
    updated = updated.split(from).join(to);
  }

  if (updated !== content) {
    writeFileSync(filePath, updated, 'utf8');
    console.log(`  Updated: ${filePath.replace(process.cwd() + '/', '')}`);
  }
}

async function main() {
  console.log('\n=== Monorepo Template Setup ===\n');

  const projectName = await ask('Project name (e.g. my-app): ');
  if (!projectName) {
    console.error('Project name is required.');
    process.exit(1);
  }

  const packageScope = await ask('Package scope (e.g. mycompany — without @): ');
  if (!packageScope) {
    console.error('Package scope is required.');
    process.exit(1);
  }

  rl.close();

  const monorepoName = `${projectName}-monorepo`;
  const dbName = projectName.replace(/[^a-z0-9_]/gi, '_');
  const containerName = `${projectName}-postgres`;

  const replacements = [
    ['@template', `@${packageScope}`],
    ['template-monorepo', monorepoName],
    ['template-postgres', containerName],
    // DB name in .env.sample and docker-compose defaults
    [`:-template}`, `:-${dbName}}`],
    [`/template\n`, `/${dbName}\n`],
    [`/template\r`, `/${dbName}\r`],
    [`=template\n`, `=${dbName}\n`],
    [`=template\r`, `=${dbName}\r`],
  ];

  console.log('\nApplying replacements across project files...\n');

  const root = process.cwd();
  const files = walkFiles(root);
  for (const file of files) {
    replaceInFile(file, replacements);
  }

  console.log('\nRunning pnpm install to update lockfile...\n');
  try {
    execSync('pnpm install', { stdio: 'inherit' });
  } catch {
    console.warn('\nWarning: pnpm install failed — run it manually.');
  }

  console.log(`
=== Setup complete! ===

Next steps:
  1. Copy the env file:
       cp apps/api/.env.sample apps/api/.env
  2. Fill in your secrets in apps/api/.env
  3. Start the database:
       docker compose up postgres -d
  4. Run the first migration:
       pnpm --filter @${packageScope}/api migrate
  5. Start development:
       docker compose up api-dev web-dev

Happy building!
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
