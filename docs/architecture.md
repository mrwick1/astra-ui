# Architecture Deep-Dives for astra-ui

A learning reference for understanding every architectural decision in a production React component library monorepo.

---

## Table of Contents

- [Why a Monorepo?](#why-a-monorepo)
- [Why pnpm Workspaces Over npm/yarn?](#why-pnpm-workspaces-over-npmyarn)
- [Why Turborepo?](#why-turborepo)
- [Why Rollup Over Webpack/esbuild for a Library?](#why-rollup-over-webpackesbuild-for-a-library)
- [Why CVA (Class Variance Authority)?](#why-cva-class-variance-authority)
- [Compound Component Pattern](#compound-component-pattern)
- [Polymorphic Components](#polymorphic-components)
- [Context-Based Component Communication](#context-based-component-communication)
- [Theme System Design](#theme-system-design)
- [Tree-Shaking Strategy](#tree-shaking-strategy)
- [Publishing Workflow](#publishing-workflow)

---

## Why a Monorepo?

astra-ui uses a single repository to house the core library (`packages/core/`), documentation site (`apps/docs/`), Storybook (`apps/storybook/`), and demo dashboards (`apps/dashboard/`, `apps/dashboard-vite/`).

### The problems a monorepo solves

**1. Code sharing without publishing.** The docs site and Storybook import `@astra-ui/core` directly via the pnpm workspace protocol (`"@astra-ui/core": "workspace:*"`). During development you see changes immediately -- no need to publish to npm, link packages manually, or manage symlinks.

**2. Atomic commits.** When a component API changes, you update the component, its tests, its Storybook story, and its docs page in a single commit. In a multi-repo setup, these would be separate PRs across separate repositories, and they would inevitably drift out of sync.

**3. Single CI pipeline.** One pipeline builds, tests, and lints everything. Turborepo handles task orchestration so the CI config stays simple:

```yaml
# In CI, one command handles everything:
pnpm build   # Turborepo builds core first, then apps that depend on it
pnpm test    # Runs all test suites across all packages
pnpm lint    # Lints all workspaces
```

**4. Consistent tooling.** Prettier config lives in the root `package.json`. ESLint config in `.eslintrc.js`. TypeScript strictness is consistent across packages. No drift between repos.

### When NOT to use a monorepo

If your packages have genuinely independent release cycles and different teams, separate repos may be simpler. But for a component library where the library, docs, and demos are tightly coupled, a monorepo is the clear choice.

---

## Why pnpm Workspaces Over npm/yarn?

The workspace definition in `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### Strict dependency resolution

pnpm creates a non-flat `node_modules` structure by default. If package A depends on lodash but package B does not list it, package B cannot accidentally import lodash. npm and yarn (classic) hoist everything flat, so unlisted dependencies silently work until they break in production.

### Disk efficiency

pnpm uses a content-addressable store. If five projects depend on `react@18.2.0`, pnpm stores one copy on disk and hard-links it into each `node_modules`. npm duplicates it five times.

### Workspace protocol

In astra-ui, apps reference the core library with:

```json
"@astra-ui/core": "workspace:*"
```

This tells pnpm "resolve this from the local workspace, not the npm registry." During `pnpm publish`, the protocol is automatically replaced with the actual version number. You never accidentally publish a package that points to `workspace:*`.

### The `.npmrc` configuration

```ini
auto-install-peers = true
node-linker=hoisted
```

- `auto-install-peers = true` -- pnpm does not install peer dependencies by default (unlike npm 7+). This flag restores the auto-install behavior, which is needed because many React ecosystem packages declare React as a peer dep.
- `node-linker=hoisted` -- This switches pnpm from its strict isolated layout back to a flat `node_modules` structure. This is a pragmatic trade-off: some tools (Storybook, Next.js) expect hoisted dependencies and break with pnpm's default layout. You lose the strict resolution guarantee but gain compatibility.

---

## Why Turborepo?

The root `package.json` runs everything through Turborepo:

```json
"build": "turbo run build",
"dev": "turbo run dev --no-cache --continue",
"lint": "turbo run lint",
"test": "turbo run test"
```

And the pipeline is defined in `turbo.json`:

```json
{
  "pipeline": {
    "build": {
      "outputs": ["dist/**", "storybook-static/**", ".next/**", "!.next/cache/**"],
      "dependsOn": ["^build"]
    },
    "test": {
      "outputs": ["coverage/**"],
      "dependsOn": []
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### What Turborepo actually does

**Task graph from `dependsOn`.** The `"^build"` syntax means: "before building this package, build all of its workspace dependencies first." So when you run `pnpm build`, Turborepo builds `@astra-ui/core` before building `apps/docs` or `apps/storybook` (because they depend on core). Without this, the apps would try to import from a `dist/` that does not exist yet.

**Build caching.** Turborepo hashes your source files, dependencies, and environment variables. If nothing changed, it replays the cached output instantly instead of rebuilding. The `outputs` array tells Turborepo which directories to cache (and restore from cache).

**Why `test` has `"dependsOn": []`.** Tests do not depend on the build output of other packages. They can run in parallel with everything else, which is faster.

**Why `dev` has `"cache": false` and `"persistent": true`.** Dev servers are long-running processes, not cacheable tasks. `persistent: true` tells Turborepo not to treat the process ending as a failure.

### Turborepo vs Nx

Nx is more feature-rich (project graph visualization, computation memoization, code generators). Turborepo is simpler -- it does task orchestration and caching, nothing else. For a component library where the task graph is straightforward, Turborepo's minimal config is a better fit.

---

## Why Rollup Over Webpack/esbuild for a Library?

The core library uses Rollup (`rollup.config.mjs`), not Webpack or esbuild. This is a deliberate choice for a library (as opposed to an application).

### Tree-shaking

Rollup was built for ES modules and produces the cleanest tree-shakeable output. When a consumer imports `import { Button } from '@astra-ui/core'`, their bundler should be able to eliminate every other component. Webpack can do this too, but its output includes more runtime boilerplate.

### `preserveModules: true`

This is the most important Rollup option for a library:

```js
const outputOptions = {
  sourcemap: false,
  preserveModules: true,
  preserveModulesRoot: 'src',
};
```

Without `preserveModules`, Rollup bundles everything into a single file. With it, Rollup preserves your source directory structure in the output:

```
dist/
  index.js                          # barrel re-exports
  components/Button/Button.js       # individual module
  components/Modal/Modal.js         # individual module
  theme/styles/button.styles.js     # individual module
```

This means a consumer's bundler can resolve imports to individual files and tree-shake at the file level. If they only use Button, they only load Button's file.

### Dual ESM + CJS output

```js
output: [
  { dir: 'dist', format: 'cjs', entryFileNames: '[name].cjs', exports: 'auto', ...outputOptions },
  { dir: 'dist', format: 'esm', ...outputOptions },
]
```

The library ships both formats:
- **ESM** (`.js`) -- for modern bundlers (Vite, webpack 5, Rollup). Tree-shakeable.
- **CJS** (`.cjs`) -- for Node.js, Jest, older tooling that does not support ESM.

The `package.json` maps these:

```json
"main": "dist/index.cjs",    // CJS consumers
"module": "dist/index.js",    // ESM consumers
"types": "dist/index.d.ts"    // TypeScript
```

### Why not Webpack?

Webpack is designed for applications (code splitting, dev server, HMR). For a library, its output includes unnecessary runtime code. Rollup produces leaner output.

### Why not esbuild?

esbuild is extremely fast but does not support `preserveModules`, does not emit declaration files (`.d.ts`), and has limited plugin support. For a library that needs fine-grained tree-shaking and TypeScript declarations, Rollup is the right tool.

---

## Why CVA (Class Variance Authority)?

CVA solves the problem of type-safe, composable styling for variant-driven components.

### The problem it solves

Without CVA, variant logic looks like this:

```tsx
// Manual approach -- error-prone, no type safety
function Button({ variant, size, ...props }) {
  const classes = [
    'px-4 rounded font-medium',
    variant === 'primary' ? 'bg-blue-500 text-white' : '',
    variant === 'secondary' ? 'bg-gray-200 text-gray-800' : '',
    size === 'sm' ? 'text-sm py-1' : '',
    size === 'lg' ? 'text-lg py-3' : '',
  ].join(' ');
  return <button className={classes} {...props} />;
}
```

This does not scale. Adding a new variant means editing a growing chain of ternaries. There is no TypeScript autocompletion for valid variant values.

### The CVA approach

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonStyles = cva(
  // Base classes (always applied)
  'inline-flex items-center justify-center rounded font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        ghost: 'bg-transparent hover:bg-gray-100',
      },
      size: {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
      },
    },
    compoundVariants: [
      // Special case: primary + lg gets extra shadow
      { variant: 'primary', size: 'lg', class: 'shadow-lg' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// Type is automatically inferred:
// { variant?: 'primary' | 'secondary' | 'ghost'; size?: 'sm' | 'md' | 'lg' }
type ButtonVariants = VariantProps<typeof buttonStyles>;
```

The key insight: CVA gives you **runtime class generation** with **compile-time type safety**. The `VariantProps` utility type extracts variant options directly from the `cva()` definition, so component props and style definitions can never drift apart.

### Integration with tailwind-merge

CVA does not deduplicate conflicting Tailwind classes. If a component applies both `px-4` (from the base) and `px-6` (from a size variant), both end up in the class string. `tailwind-merge` resolves this by keeping only the last conflicting class.

In practice, astra-ui components call:

```tsx
import { twMerge } from 'tailwind-merge';

// In the component:
<button className={twMerge(buttonStyles({ variant, size }), className)} />
```

This also lets consumers override library styles by passing their own `className`.

---

## Compound Component Pattern

Compound components expose related sub-components as properties of a parent:

```tsx
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>

<Accordion>
  <Accordion.Item value="1">
    <Accordion.Trigger>Click me</Accordion.Trigger>
    <Accordion.Panel>Hidden content</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

### Why this pattern?

**Explicit composition.** The consumer controls the layout. They can put `Card.Footer` before `Card.Body` if they want. They can omit `Card.Header` entirely. The library does not force a rigid structure.

**Shared state without prop drilling.** The parent (e.g., `Accordion`) provides shared state (which item is open) via React Context. The children (e.g., `Accordion.Trigger`, `Accordion.Panel`) consume it. The consumer never sees this state -- they just compose the pieces.

### Implementation pattern

```tsx
// Card/Card.tsx
const Card = ({ children, className, ...props }) => (
  <div className={twMerge(cardStyles(), className)} {...props}>
    {children}
  </div>
);

// Card/CardHeader.tsx
const CardHeader = ({ children, className, ...props }) => (
  <div className={twMerge(cardHeaderStyles(), className)} {...props}>
    {children}
  </div>
);

// Card/index.ts -- attach sub-components as static properties
import { Card as CardRoot } from './Card';
import { CardHeader } from './CardHeader';
import { CardBody } from './CardBody';
import { CardFooter } from './CardFooter';

const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});

export { Card };
```

The `Object.assign` technique is cleaner than setting properties after the fact and preserves TypeScript types.

---

## Polymorphic Components

A polymorphic component can render as different HTML elements or other React components via an `as` prop:

```tsx
<Button as="a" href="/login">Log In</Button>    // renders <a>
<Button as="button" type="submit">Submit</Button> // renders <button>
<Button as={Link} to="/home">Home</Button>         // renders React Router Link
```

### Why this matters

Without polymorphism, you would need `ButtonLink`, `ButtonSubmit`, `ButtonRouterLink`, etc. The `as` prop provides a single component that adapts to its rendering context while keeping all the Button styling and behavior.

### Type-safe implementation

The hard part is TypeScript. When `as="a"`, the component should accept `href`. When `as="button"`, it should accept `type`. The `PolymorphicComponentProp` type handles this:

```tsx
type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;
```

This generic type:
1. Takes the component's own props (`Props`)
2. Adds the `as` prop
3. Merges in the native props of whatever element `C` is
4. Omits any conflicting keys (so the component's own props take priority)

---

## Context-Based Component Communication

Some components in a library need to implicitly communicate. For example:

- `FormControl` wraps an `Input` and provides error state, label association, and required indicators
- `InputGroup` wraps `Input` and addon `Button` components, adjusting border radii

### How it works

```tsx
// FormControl provides context
const FormControlContext = createContext({ isInvalid: false, isRequired: false, id: '' });

const FormControl = ({ isInvalid, isRequired, children }) => {
  const id = useId();
  return (
    <FormControlContext.Provider value={{ isInvalid, isRequired, id }}>
      <div role="group">{children}</div>
    </FormControlContext.Provider>
  );
};

// Input consumes it automatically
const Input = forwardRef((props, ref) => {
  const { isInvalid, isRequired, id } = useContext(FormControlContext);
  return (
    <input
      ref={ref}
      id={id}
      aria-invalid={isInvalid}
      aria-required={isRequired}
      {...props}
    />
  );
});
```

The consumer writes:

```tsx
<FormControl isInvalid={!!errors.email} isRequired>
  <FormControl.Label>Email</FormControl.Label>
  <Input placeholder="you@example.com" />
  <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>
</FormControl>
```

No prop drilling. The `Input` automatically picks up `isInvalid` and `isRequired` from the wrapping `FormControl`.

---

## Theme System Design

astra-ui uses a centralized theme system with two layers: a global `ThemeContext` and per-component CVA styles.

### Global ThemeContext

The `ThemeProvider` wraps the app and provides the active theme (color scheme, radius, density):

```tsx
<ThemeProvider theme={{ colorScheme: 'blue', radius: 'md', size: 'md' }}>
  <App />
</ThemeProvider>
```

### VariantContext for contextual overrides

Sometimes a section of the UI needs a different variant. A `VariantContext` lets you override theme values for a subtree:

```tsx
<VariantContext.Provider value={{ size: 'sm', colorScheme: 'red' }}>
  {/* All components in here use sm size and red scheme */}
  <Button>Delete</Button>
  <Badge>Danger</Badge>
</VariantContext.Provider>
```

### Per-component styles via `useComponentTheme`

Components do not hardcode their styles. They call `useComponentTheme('Button')` which:

1. Reads the global theme from `ThemeContext`
2. Reads any overrides from `VariantContext`
3. Looks up the CVA style definition in `theme/styles/button.styles.ts`
4. Returns the resolved class string

```tsx
// Inside Button.tsx
const Button = ({ variant, size, ...props }) => {
  const theme = useComponentTheme('Button');
  const classes = theme({ variant, size });
  return <button className={classes} {...props} />;
};
```

### Style definitions live in `theme/styles/`

Each component's CVA definition is in a separate file:

```
packages/core/src/theme/styles/
  button.styles.ts
  input.styles.ts
  modal.styles.ts
  ...
```

This separation means:
- Theme styles are tree-shakeable independently of components
- A consumer can import and extend a style definition without importing the component
- The Rollup config conditionally skips minification for theme files (via `conditionalTerser`) so they remain readable in development

---

## Tree-Shaking Strategy

Tree-shaking is the process of eliminating dead code from the final bundle. For a component library, this is critical -- if a consumer uses only `Button`, they should not ship code for `Modal`, `DatePicker`, and all 32 other components.

### Three pillars of tree-shaking in astra-ui

**1. `sideEffects: false` in `package.json`.**

```json
"sideEffects": false
```

This tells the consumer's bundler: "Every module in this package is side-effect-free. If an import is unused, you can safely remove the entire module." Without this flag, bundlers conservatively keep all modules because they might have side effects (like global CSS or polyfills).

**2. `preserveModules: true` in Rollup.**

Instead of bundling everything into one file, Rollup preserves the source directory structure:

```
dist/
  components/Button/Button.js    # only loaded if Button is imported
  components/Modal/Modal.js      # only loaded if Modal is imported
```

This gives the consumer's bundler file-level granularity for dead code elimination.

**3. Barrel exports in `index.ts`.**

The entry point re-exports everything:

```ts
export { Button } from './components/Button';
export { Modal } from './components/Modal';
// ...
```

Because of `preserveModules`, each of these re-exports resolves to a separate file. Combined with `sideEffects: false`, an unused re-export is completely eliminated.

### Why all three are needed

- `sideEffects: false` alone is not enough if everything is in one file (the bundler cannot partially include a file).
- `preserveModules` alone is not enough if the bundler thinks modules have side effects.
- Barrel exports alone are not enough without the other two (they would pull in everything).

All three work together to achieve optimal tree-shaking.

---

## Publishing Workflow

astra-ui uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing. Only `@astra-ui/core` publishes to npm; the apps (`docs`, `storybook`, `dashboard`) are private.

### The workflow

**Step 1: Developer adds a changeset.**

```bash
pnpm changeset
# Interactive prompt:
# Which packages changed? @astra-ui/core
# What type of change? minor (new feature) / patch (bugfix) / major (breaking)
# Summary: Added Combobox component with keyboard navigation
```

This creates a markdown file in `.changeset/`:

```
---
'@astra-ui/core': minor
---

Added Combobox component with keyboard navigation
```

**Step 2: Changesets are accumulated.** Multiple developers add changesets over time. Each PR that changes the library includes a changeset file.

**Step 3: Version bump.**

```bash
pnpm version-packages   # runs "changeset version"
```

This reads all pending changeset files, determines the version bump (the highest semver change wins), updates `package.json` version, and writes `CHANGELOG.md`.

**Step 4: Publish.**

```bash
pnpm release
```

This runs the full pipeline from the root `package.json`:

```json
"release": "turbo run build --filter=docs^... --filter=storybook^... && turbo run lint && turbo run test && changeset publish"
```

The `--filter=docs^...` syntax means "build everything that docs depends on, but not docs itself." This ensures `@astra-ui/core` is built and tested before publishing, without wasting time building the docs site.

### Changeset config

```json
{
  "access": "public",
  "updateInternalDependencies": "patch",
  "ignore": ["@astra-ui/docs", "@astra-ui/storybook", "@astra-ui/dashboard", "@astra-ui/dashboard-vite"],
  "baseBranch": "master"
}
```

- `access: "public"` -- publishes as a public npm package (not behind an org scope paywall).
- `updateInternalDependencies: "patch"` -- when core bumps, internal apps that depend on it get a patch bump automatically.
- `ignore` -- these packages never get published to npm. They are private workspace apps.
