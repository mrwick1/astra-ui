# Astra UI

A comprehensive React component library built with Tailwind CSS. 50+ accessible, themeable components with dark mode support, design tokens, and full TypeScript coverage.


![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

## Features

- **50+ Components** — Buttons, inputs, modals, tables, navigation, and more
- **Dark Mode** — Built-in light/dark theme support
- **Accessible** — ARIA compliant with keyboard navigation
- **Themeable** — Customizable design tokens and variants
- **TypeScript** — Full type coverage with IntelliSense support
- **Tree Shakeable** — Import only what you need

## Installation

```bash
npm install @astra-ui/core
```

## Quick Start

```tsx
import { Button, Card, Text } from '@astra-ui/core';

function App() {
  return (
    <Card shadow="md" radius="lg">
      <Text size="lg" weight="bold">Hello Astra UI</Text>
      <Button color="purple" variant="solid">
        Get Started
      </Button>
    </Card>
  );
}
```

## Component Categories

| Category | Components |
|----------|-----------|
| Layout | Card, Container, Flexbox, Grid |
| Navigation | Navbar, Sidebar, Breadcrumb, Tabs |
| Forms | Input, Select, Checkbox, Radio, Switch, Slider |
| Feedback | Alert, Badge, Modal, Drawer, Toast, Tooltip |
| Data Display | Table, Accordion, Avatar, Calendar, Timeline |
| Typography | Text, Title, Code |

## Tech Stack

- **React 18** — Component architecture with hooks
- **Tailwind CSS** — Utility-first styling with design tokens
- **TypeScript** — End-to-end type safety
- **CVA** — Class Variance Authority for component variants
- **Turborepo** — Monorepo build orchestration
- **Storybook** — Component documentation and visual testing
- **Changesets** — Version management and changelogs

## Monorepo Structure

```
astra-ui/
├── packages/core/     # Component library (npm package)
├── apps/docs/         # Documentation site (Next.js)
├── apps/storybook/    # Component stories
└── apps/dashboard/    # Demo dashboard app
```

## Architecture

Components use CVA (Class Variance Authority) for variant management, enabling type-safe prop-to-class mappings. The design token system is built on Tailwind's configuration, allowing global theme customization through a single config file. Each component supports multiple variants (size, color, radius, shadow) with sensible defaults.

## License

MIT
