import { cp, mkdir, readdir, rm } from 'node:fs/promises';

import { generateFiles } from 'fumadocs-openapi';
import { createOpenAPI } from 'fumadocs-openapi/server';

const generated = './content/docs/api';
const manualPagesDir = './.generated-backup';
const manualIndex = `${manualPagesDir}/api-index.mdx`;

const openapi = createOpenAPI({
  input: ['./openapi.json'],
});

// Back up hand-written pages under api/ (e.g. index.mdx) so they survive regeneration.
// Generated pages live in route-named subfolders (api/users/, api/posts/, ...).
await rm(manualPagesDir, { recursive: true, force: true });
await mkdir(manualPagesDir, { recursive: true });
let manualFiles = [];
try {
  // Top-level .mdx files under api/ are hand-written; generated pages live in
  // route-named subfolders (api/users/, api/posts/, ...)
  manualFiles = (await readdir(generated)).filter((entry) => entry.endsWith('.mdx'));
  for (const file of manualFiles) {
    await cp(`${generated}/${file}`, `${manualPagesDir}/${file}`);
  }
} catch {
  // api/ does not exist yet (first run) — nothing to back up
}

await rm(generated, { recursive: true, force: true });

await generateFiles({
  input: openapi,
  output: './content/docs',
  per: 'operation',
  groupBy: 'route',
  includeDescription: true,
});

// Restore hand-written pages
await mkdir(generated, { recursive: true });
for (const file of manualFiles) {
  await cp(`${manualPagesDir}/${file}`, `${generated}/${file}`);
}
await rm(manualPagesDir, { recursive: true, force: true });

console.log(`API reference pages generated in ${generated}`);
