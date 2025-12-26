# Astra UI

A React component library built with Tailwind CSS, Class Variance Authority, and TypeScript. Provides accessible, themeable components with a powerful variant system and full type safety.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![npm](https://img.shields.io/badge/npm-@astra--ui--lib/core-CB3837?style=flat-square&logo=npm&logoColor=white)

## Features

- **Variant System** — Type-safe variants powered by CVA (Class Variance Authority)
- **Themeable** — Context-based theme and variant providers for global customization
- **Polymorphic Components** — Render as any HTML element with the `as` prop
- **Accessible** — ARIA compliant with keyboard navigation hooks
- **TypeScript First** — Full type coverage with IntelliSense support
- **Tree Shakeable** — ESM and CJS builds, import only what you need
- **Tested** — Unit tests with Vitest, accessibility tests with jest-axe

## Installation

```bash
npm install @astra-ui-lib/core
# or
pnpm add @astra-ui-lib/core
```

## Quick Start

```tsx
import { Badge, Text, Spinner } from '@astra-ui-lib/core';

function App() {
  return (
    <div>
      <Text variant="h1" size="2xl" weight="bold">
        Hello Astra UI
      </Text>
      <Badge color="purple" tone="solid" size="md">
        New
      </Badge>
      <Spinner size="md" color="gray" />
    </div>
  );
}
```

## Components

| Component | Description | Variants |
|-----------|-------------|----------|
| **Badge** | Status labels and tags | 6 colors, 4 tones (solid/light/glossy/outline), 4 sizes |
| **Text** | Polymorphic typography | 13 variants (h1-h6, p, d1-d4), 9 sizes, 9 weights |
| **Spinner** | Loading indicator | 3 colors, 5 sizes |

## Theming

Wrap your app with `ThemeProvider` to customize component styles globally:

```tsx
import { ThemeProvider } from '@astra-ui-lib/core';

const theme = {
  components: {
    Badge: { /* override base styles */ },
    Text: { /* override base styles */ },
  },
};

function App() {
  return (
    <ThemeProvider value={theme}>
      {/* Your app */}
    </ThemeProvider>
  );
}
```

## Tech Stack

- **React 18** — Component architecture with hooks and forwardRef
- **Tailwind CSS** — Utility-first styling with design tokens
- **CVA** — Class Variance Authority for type-safe variant management
- **Turborepo** — Monorepo build orchestration
- **Rollup** — Library bundling (CJS + ESM output)
- **Vitest** — Unit and accessibility testing
- **Changesets** — Automated versioning and npm publishing

## Monorepo Structure

```
astra-ui/
├── packages/core/
│   └── src/
│       ├── components/    # Badge, Text, Spinner
│       ├── hooks/         # Focus trap, keyboard navigation, context utilities
│       ├── animations/    # useFade hook
│       ├── theme/         # Theme/variant contexts, CVA styles
│       ├── types/         # Polymorphic component types
│       ├── utils/         # ID generation, slug, layout effects
│       └── helpers/       # Arrow positioning, text normalization
├── .changeset/            # Version management
└── .github/workflows/     # CI/CD release pipeline
```

## Development

```bash
git clone https://github.com/mrwick1/astra-ui.git
cd astra-ui
pnpm install
pnpm build          # Build all packages
pnpm test           # Run tests
pnpm dev            # Watch mode
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding new components.

## License

[MIT](LICENSE)
