import { rm } from 'node:fs/promises';

import { generateFiles } from 'fumadocs-openapi';
import { createOpenAPI } from 'fumadocs-openapi/server';

const out = './content/docs';

const openapi = createOpenAPI({
  input: ['./openapi.json'],
});

await rm(out, { recursive: true, force: true });

await generateFiles({
  input: openapi,
  output: out,
  per: 'operation',
  groupBy: 'route',
  includeDescription: true,
});

console.log(`API reference pages generated in ${out}`);
