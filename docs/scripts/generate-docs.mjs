import { rm } from 'node:fs/promises';

import { generateFiles } from 'fumadocs-openapi';
import { createOpenAPI } from 'fumadocs-openapi/server';

const generated = './content/docs/api';

const openapi = createOpenAPI({
  input: ['./openapi.json'],
});

// Only clean the generated folder, leaving hand-written pages (e.g. index.mdx) intact
await rm(generated, { recursive: true, force: true });

await generateFiles({
  input: openapi,
  output: './content/docs',
  per: 'operation',
  groupBy: 'route',
  includeDescription: true,
});

console.log(`API reference pages generated in ${generated}`);
