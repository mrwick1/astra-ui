import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0A0A0A',
          raised: '#111111',
          overlay: '#1A1A1A',
        },
        fg: {
          DEFAULT: '#E8E8E8',
          muted: '#888888',
          subtle: '#555555',
        },
        border: {
          DEFAULT: '#262626',
          hover: '#404040',
          focus: '#0055FF',
        },
        accent: {
          DEFAULT: '#0055FF',
          hover: '#0044CC',
          light: 'rgba(0, 85, 255, 0.1)',
        },
        status: {
          success: '#22C55E',
          warning: '#EAB308',
          error: '#EF4444',
          info: '#0055FF',
        },
      },
      fontFamily: {
        body: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        none: '0px',
      },
    },
  },
  plugins: [],
};

export default config;
