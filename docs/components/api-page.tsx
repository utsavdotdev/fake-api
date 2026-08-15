'use client';

import { createOpenAPIPage } from 'fumadocs-openapi/ui';
import { createCodeUsageGeneratorRegistry } from 'fumadocs-openapi/requests/generators';
import { registerDefault } from 'fumadocs-openapi/requests/generators/all';

export const OpenAPIPage = createOpenAPIPage({
  codeUsages: registerDefault(createCodeUsageGeneratorRegistry()),
});
