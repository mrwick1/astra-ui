import coreConfig from '../../packages/core/tailwind.config.ts';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/core/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      ...coreConfig.theme.extend,
      fontFamily: {
        ...coreConfig.theme.extend.fontFamily,
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
