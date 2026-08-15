import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import swaggerSpec from '../src/docs/swagger.js';

const here = dirname(fileURLToPath(import.meta.url));
const output = join(here, '..', 'docs', 'openapi.json');

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(swaggerSpec, null, 2)}\n`);

console.log(`OpenAPI spec written to ${output}`);
