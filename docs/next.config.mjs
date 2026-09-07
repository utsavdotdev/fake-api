import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  // Served at https://<owner>.github.io/fake-api/. The Express dev server
  // mounts `docs/out` at `/fake-api/docs` to mirror this in `npm start`.
  basePath: '/fake-api',
  turbopack: {
    root: import.meta.dirname,
  },
};

const withMDX = createMDX();

export default withMDX(config);
