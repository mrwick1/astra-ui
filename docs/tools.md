# Tool-by-Tool Reference

A practical guide to every tool in the astra-ui stack — what it does, why it was chosen, and how it's configured.

---

## pnpm

**What it is:** A fast, disk-efficient package manager for Node.js.

### Why pnpm over npm/yarn?

| Feature | npm | yarn classic | pnpm |
|---------|-----|-------------|------|
| Disk usage | Duplicates per project | Duplicates per project | Content-addressable store, hard links |
| Phantom deps | Allows (hoisted flat) | Allows (hoisted flat) | Blocks by default (strict isolation) |
| Workspace protocol | No | No | `workspace:*` auto-resolved on publish |
| Install speed | Slowest | Fast | Fastest (parallel, cached) |

### Key config: `.npmrc`

```ini
auto-install-peers = true    # Auto-install peer deps (React, etc.)
node-linker=hoisted          # Flat node_modules for Storybook/Next.js compatibility
```

`node-linker=hoisted` is a trade-off: you lose strict isolation but gain compatibility with tools that expect flat `node_modules`.

### Workspace protocol

```json
// In apps/storybook/package.json:
"@astra-ui/core": "workspace:*"
```

During development, this resolves to the local package. During `pnpm publish`, it's replaced with the actual version number automatically.

---

## Turborepo

**What it is:** A build orchestrator for JavaScript/TypeScript monorepos.

### Pipeline config (`turbo.json`)

```json
{
  "pipeline": {
    "build": {
      "outputs": ["dist/**", ".next/**"],
      "dependsOn": ["^build"]        // Build dependencies first
    },
    "test": {
      "outputs": ["coverage/**"],
      "dependsOn": []                // Tests run independently
    },
    "dev": {
      "cache": false,                // Dev servers aren't cacheable
      "persistent": true             // Long-running process
    }
  }
}
```

### Key concepts

- **`dependsOn: ["^build"]`** — The `^` means "workspace dependencies." Before building `apps/docs`, Turborepo builds `packages/core` first (because docs depends on core).
- **`outputs`** — Directories to cache. Next build: re-run → takes 30s. Cached: replayed → takes 0.5s.
- **`persistent: true`** — Tells Turborepo the process is a long-running server, not a one-shot task.

### How caching works

Turborepo hashes: source files + dependencies + env vars → fingerprint. If fingerprint matches a previous build, it replays the cached `outputs` instead of rebuilding. This makes `pnpm build` near-instant when nothing changed.

---

## Rollup

**What it is:** A module bundler optimized for libraries (as opposed to Webpack which targets applications).

### Plugin chain explained

Each plugin in `rollup.config.mjs` serves a specific purpose:

```js
plugins: [
  peerDepsExternal(),       // 1. Exclude peer deps (react, react-dom) from bundle
  resolve(),                // 2. Resolve node_modules imports
  commonjs(),               // 3. Convert CommonJS modules to ESM
  typescript({...}),        // 4. Compile TypeScript, emit .d.ts declarations
  typescriptPaths(),        // 5. Resolve path aliases (@components/* → ./src/components/*)
  preserveDirectives(),     // 6. Keep 'use client' directives in output
  conditionalTerser(...),   // 7. Minify (except theme style files)
  copy({...}),              // 8. Copy README into dist/
  tscAlias(),               // 9. Resolve path aliases in .d.ts files
]
```

### Why each plugin matters

**`peerDepsExternal()`** — React is a peer dependency. Without this, Rollup would bundle React into the library, causing "two Reacts" errors when consumers already have React installed.

**`preserveDirectives()`** — Next.js App Router requires `'use client'` at the top of client components. Rollup normally strips unknown directives. This plugin preserves them.

**`conditionalTerser()`** — Custom plugin that minifies everything except theme style files. Theme styles are kept readable so consumers can inspect and override them.

**`tscAlias()`** — Rollup resolves path aliases in `.js` files, but not in `.d.ts` declaration files. This plugin runs `tsc-alias` after bundling to fix the declarations.

### `preserveModules: true`

The most critical setting for library tree-shaking:

```
Without preserveModules:     With preserveModules:
dist/                        dist/
  index.js (everything)        index.js (re-exports only)
                               components/Button/Button.js
                               components/Modal/Modal.js
                               theme/styles/button.styles.js
```

Consumers' bundlers can eliminate unused files entirely when modules are preserved.

---

## TypeScript 5.x

### Strict mode flags in `tsconfig.json`

```json
{
  "strict": true,                      // Enables all strict checks
  "noUnusedLocals": true,              // Error on unused variables
  "noUnusedParameters": true,          // Error on unused function params
  "forceConsistentCasingInFileNames": true,  // Prevent case-sensitivity bugs
  "isolatedModules": true              // Required for Rollup/esbuild
}
```

### Why `isolatedModules: true`?

Rollup and esbuild compile each file independently (they don't do whole-program analysis like `tsc`). `isolatedModules` ensures you don't use TypeScript features that require cross-file analysis (like `const enum` or `export =`).

### ES2020 target (upgraded from ES6)

ES2020 supports: optional chaining (`?.`), nullish coalescing (`??`), `Promise.allSettled`, `BigInt`, `globalThis`. These are supported in all modern browsers and Node 14+. Targeting ES6 unnecessarily transpiled these features, adding code bloat.

### Path aliases

```json
"paths": {
  "@components/*": ["./src/components/*"],
  "@icons/*": ["./src/icons/*"],
  "@theme/*": ["./src/theme/*"],
  "@utils/*": ["./src/utils/*"],
  "@hooks/*": ["./src/hooks/*"],
  "@types": ["./src/types"],
  "@animations/*": ["./src/animations/*"],
  "@helpers/*": ["./src/helpers/*"]
}
```

Path aliases prevent deep relative imports (`../../../theme/styles/button.styles`) in favor of clean imports (`@theme/styles/button.styles`). They must be resolved by both TypeScript (for type-checking) and Rollup (for bundling), which is why we need both `tsconfig.json` paths and the `typescriptPaths()` Rollup plugin.

---

## Vitest

**What it is:** A Vite-native test runner, replacement for Jest.

### Why Vitest over Jest?

| Feature | Jest | Vitest |
|---------|------|--------|
| ESM support | Requires transforms | Native |
| TypeScript | Needs babel/ts-jest | Uses Vite's transform |
| Config reuse | Separate jest.config | Shares vite.config |
| Speed | Good | Faster (Vite's transform pipeline) |
| HMR in watch | No | Yes |

### Configuration

```ts
// vitest.config.ts
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,       // Enables describe/it/expect without imports
    environment: 'jsdom' // Simulates browser DOM for React components
  },
});
```

`globals: true` means you write `describe('Button', ...)` instead of `import { describe } from 'vitest'`. Matches Jest convention.

`environment: 'jsdom'` provides a browser-like DOM so `document.createElement`, `addEventListener`, etc. work in tests.

---

## CVA (Class Variance Authority)

**What it is:** A utility for defining type-safe component style variants.

### Core API

```ts
import { cva, type VariantProps } from 'class-variance-authority';

const buttonStyles = cva(
  'base-classes-always-applied',
  {
    variants: {
      size: {
        sm: 'text-sm px-2',
        md: 'text-base px-4',
        lg: 'text-lg px-6',
      },
      color: {
        blue: 'bg-blue-500',
        red: 'bg-red-500',
      },
    },
    compoundVariants: [
      // Applied only when BOTH conditions match
      { size: 'lg', color: 'red', class: 'font-bold shadow-lg' },
    ],
    defaultVariants: {
      size: 'md',
      color: 'blue',
    },
  }
);

// Usage:
buttonStyles({ size: 'lg', color: 'red' })
// → 'base-classes-always-applied text-lg px-6 bg-red-500 font-bold shadow-lg'

// Type extraction:
type ButtonVariants = VariantProps<typeof buttonStyles>;
// → { size?: 'sm' | 'md' | 'lg'; color?: 'blue' | 'red' }
```

### Why `compoundVariants`?

Sometimes a specific combination of variants needs extra styles. Instead of `if (size === 'lg' && color === 'red')` logic in the component, you declare it in the style definition. Keeps components clean.

---

## tailwind-merge

**What it is:** A utility that intelligently merges Tailwind CSS classes, resolving conflicts.

### The problem

```ts
// Without tailwind-merge:
className = 'px-4 px-6'  // Both applied — browser uses last one (CSS order dependent)

// With tailwind-merge:
twMerge('px-4', 'px-6')  // → 'px-6' (removes conflicting px-4)
```

### Why it matters for component libraries

Components have base styles, but consumers need to override them:

```tsx
<Button className="px-8" />  // Consumer wants wider padding
```

Without `twMerge`, the component's `px-4` and the consumer's `px-8` would both be in the class string, with unpredictable results. With `twMerge`, the consumer's class wins.

---

## @floating-ui/react

**What it is:** A positioning library for tooltips, popovers, dropdowns — anything that "floats" near a trigger element.

### Core concept

```tsx
import { useFloating, offset, flip, shift } from '@floating-ui/react';

const { refs, floatingStyles } = useFloating({
  placement: 'bottom',
  middleware: [
    offset(8),    // 8px gap between trigger and floating element
    flip(),       // Flip to top if no room at bottom
    shift(),      // Shift left/right to stay in viewport
  ],
});

// refs.setReference → attach to trigger element
// refs.setFloating → attach to floating element
// floatingStyles → { position, top, left } to apply
```

### Middleware pipeline

Middleware runs in order. Each one can adjust the position:

1. **`offset(8)`** — Adds spacing between trigger and popup
2. **`flip()`** — If popup would overflow viewport, flip to opposite side
3. **`shift()`** — If still overflowing, shift along the axis to stay visible

This replaces manual `getBoundingClientRect()` calculations and handles edge cases (scroll containers, iframes, zoom levels).

---

## Framer Motion

**What it is:** A React animation library.

### Used in astra-ui for

- **Collapse** — Animate height from 0 to auto (impossible with CSS transitions alone)
- **Modal/Drawer** — Enter/exit animations with `AnimatePresence`
- **useFade hook** — Fade in/out with Web Animations API fallback

### `AnimatePresence` pattern

```tsx
import { AnimatePresence, motion } from 'framer-motion';

function Modal({ isOpen, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}    // Start state
          animate={{ opacity: 1, scale: 1 }}         // Animate to
          exit={{ opacity: 0, scale: 0.95 }}         // Animate out
          transition={{ duration: 0.15 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

`AnimatePresence` is the key: it keeps the component mounted during the exit animation, then removes it from the DOM. Without it, React unmounts immediately and you never see the exit animation.

---

## Changesets

**What it is:** A versioning and changelog management tool for monorepos.

### Workflow

```bash
# 1. After making changes, add a changeset:
pnpm changeset
# → Interactive: select packages, semver bump type, write summary

# 2. Before release, consume changesets:
pnpm version-packages
# → Bumps package.json versions, writes CHANGELOG.md

# 3. Publish:
pnpm release
# → Builds, lints, tests, then publishes to npm
```

### Config (`changeset/config.json`)

```json
{
  "access": "public",                    // Public npm package
  "baseBranch": "master",               // Branch to compare against
  "ignore": ["@astra-ui/docs", ...],    // Never publish these packages
  "updateInternalDependencies": "patch"  // Auto-bump dependents
}
```

---

## ESLint + Prettier

### Why both?

- **ESLint** — Catches code quality issues (unused vars, missing deps in hooks, etc.)
- **Prettier** — Formats code (indentation, line width, quotes, semicolons)

They serve different purposes. Prettier handles formatting so ESLint doesn't have to.

### Config hierarchy in monorepos

```
.eslintrc.js (root)          ← shared rules for all packages
  └── packages/core/.eslintrc ← can extend/override root
  └── apps/docs/.eslintrc     ← can extend/override root
```

Root config:

```js
module.exports = {
  root: true,                  // Stop ESLint from looking for configs above this
  settings: {
    next: { rootDir: ['apps/*/'] },  // Tell Next.js ESLint plugin where Next apps live
  },
};
```

### Prettier config (in root `package.json`)

```json
"prettier": {
  "printWidth": 100,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

Living in `package.json` means no extra config file. All packages inherit this.
