import { openapi } from '@/lib/openapi';

export const { GET, HEAD, PUT, POST, PATCH, DELETE } = openapi.createProxy({
  allowedOrigins: ['http://localhost:3000', 'http://localhost:4100'],
});
