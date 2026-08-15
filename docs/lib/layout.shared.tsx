import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'MockNest API',
    },
    links: [
      {
        text: 'API Reference',
        url: '/docs/api',
        active: 'nested-url',
      },
    ],
  };
}
