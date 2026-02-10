# React Patterns Used in astra-ui

A reference for the React and TypeScript patterns used throughout the component library.

---

## Table of Contents

- [Polymorphic `as` Prop](#polymorphic-as-prop)
- [Compound Components](#compound-components)
- [Controlled vs Uncontrolled Components](#controlled-vs-uncontrolled-components)
- [forwardRef Pattern](#forwardref-pattern)
- [Custom Hooks](#custom-hooks)
- [Reducer Pattern for Complex State](#reducer-pattern-for-complex-state)
- ['use client' Directive](#use-client-directive)
- [Accessibility Patterns](#accessibility-patterns)
- [Why Tailwind + CVA Instead of CSS-in-JS](#why-tailwind--cva-instead-of-css-in-js)
- [Component Testing Strategy](#component-testing-strategy)

---

## Polymorphic `as` Prop

Allows a component to render as any HTML element or React component:

```tsx
<Text as="p">Paragraph</Text>      // renders <p>
<Text as="span">Inline</Text>      // renders <span>
<Text as="label">Label</Text>      // renders <label>
<Button as="a" href="/home">Link</Button>  // renders <a> with button styles
```

### The TypeScript challenge

When `as="a"`, the component must accept `href`. When `as="button"`, it must accept `type`. This is solved with conditional types:

```tsx
// src/types/polymorphic.types.ts

type AsProp<C extends ElementType> = { as?: C };

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

// The magic: merge component props with element props, removing conflicts
type PolymorphicComponentProp<C extends ElementType, Props = {}> =
  PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;
```

### How `PropsToOmit` works

If your component has a `color` prop and you render `as="input"` (which also has a native `color` attribute), there's a conflict. `PropsToOmit` ensures your component's `color` wins by omitting the native one from the merged type.

### Usage in a component

```tsx
type TextProps<C extends ElementType> = PolymorphicComponentProp<C, {
  size?: 'sm' | 'md' | 'lg';
  weight?: 'normal' | 'bold';
}>;

const Text = <C extends ElementType = 'p'>({
  as,
  size = 'md',
  weight = 'normal',
  children,
  ...rest
}: TextProps<C>) => {
  const Component = as || 'p';
  return <Component className={textStyles({ size, weight })} {...rest}>{children}</Component>;
};
```

The generic `C extends ElementType = 'p'` means the default element is `<p>`, but TypeScript narrows it based on what the consumer passes to `as`.

---

## Compound Components

Components that work together through implicit shared state:

```tsx
<Accordion>
  <Accordion.Item value="faq-1">
    <Accordion.Header>What is astra-ui?</Accordion.Header>
    <Accordion.Body>A React component library.</Accordion.Body>
  </Accordion.Item>
</Accordion>
```

### Two implementation approaches

**1. Context-based (used for stateful compounds like Accordion, Tabs):**

```tsx
// Parent creates context
const AccordionContext = createContext<{ activeItem: string; toggle: (id: string) => void }>();

const Accordion = ({ children }) => {
  const [activeItem, setActiveItem] = useState('');
  return (
    <AccordionContext.Provider value={{ activeItem, toggle: setActiveItem }}>
      <div>{children}</div>
    </AccordionContext.Provider>
  );
};

// Child consumes context
const AccordionHeader = ({ children }) => {
  const { toggle } = useContext(AccordionContext);
  const { value } = useContext(AccordionItemContext); // from parent Item
  return <button onClick={() => toggle(value)}>{children}</button>;
};
```

**2. Object.assign (used for stateless compounds like Card):**

```tsx
const Card = Object.assign(
  ({ children, ...props }) => <div {...props}>{children}</div>,
  {
    Header: CardHeader,
    Body: CardBody,
    Footer: CardFooter,
    Image: CardImage,
  }
);
```

### Why `Object.assign` instead of `Card.Header = CardHeader`?

`Object.assign` preserves TypeScript's type inference. Direct property assignment (`Card.Header = CardHeader`) loses the type of the base component.

---

## Controlled vs Uncontrolled Components

### Uncontrolled (internal state)

```tsx
// Consumer doesn't manage state — component handles it internally
<Checkbox defaultChecked={true} />
<Input defaultValue="hello" />
```

### Controlled (external state)

```tsx
// Consumer manages state — component is a pure render
const [checked, setChecked] = useState(true);
<Checkbox checked={checked} onChange={setChecked} />
```

### Supporting both

astra-ui components support both patterns:

```tsx
const Checkbox = ({ checked: controlledChecked, defaultChecked, onChange, ...props }) => {
  // Internal state for uncontrolled mode
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);

  // Use controlled value if provided, otherwise internal
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  const handleChange = () => {
    const newValue = !isChecked;
    setInternalChecked(newValue);  // Update internal state (ignored if controlled)
    onChange?.(newValue);           // Notify parent
  };

  return <input type="checkbox" checked={isChecked} onChange={handleChange} {...props} />;
};
```

The key: if `checked` (controlled) is provided, the component ignores its internal state.

---

## forwardRef Pattern

Lets parent components access the underlying DOM element of a library component:

```tsx
const inputRef = useRef<HTMLInputElement>(null);

// Consumer can now focus, scroll to, or measure the input
<Input ref={inputRef} />

// Later:
inputRef.current?.focus();
```

### Implementation

```tsx
import { forwardRef } from 'react';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size, variant, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={twMerge(inputStyles({ size, variant }), className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';  // Required for React DevTools
```

### Why `displayName`?

`forwardRef` wraps your component in an anonymous function. Without `displayName`, React DevTools shows `<ForwardRef>` instead of `<Input>`. Always set it.

---

## Custom Hooks

### `useFocusTrap`

Traps keyboard focus within a container (essential for modals and drawers):

```tsx
const useFocusTrap = (containerRef, isActive) => {
  useEffect(() => {
    if (!isActive) return;
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();  // Wrap to last element
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus(); // Wrap to first element
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    first?.focus(); // Auto-focus first element when trap activates

    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);
};
```

### `useKeypress`

Listens for specific key presses:

```tsx
useKeypress('Escape', () => setIsOpen(false));
useKeypress('Enter', handleSubmit);
```

### `useVerticalArrows` / `useHorizontalArrows`

Manages arrow key navigation through a list of items (used in Select, Combobox, Dropdown):

```tsx
const { activeIndex } = useVerticalArrows({
  itemCount: options.length,
  onSelect: (index) => selectOption(options[index]),
});
```

### `usePropId`

Generates a stable ID for ARIA attributes, using the consumer's ID if provided:

```tsx
// Fixed in rebuild: param type changed from `any` to `string | undefined`
const usePropId = (propId?: string | undefined): string => {
  const generatedId = useId();
  return propId || generatedId;
};
```

This ensures `aria-labelledby`, `aria-describedby`, etc. always have a valid ID.

---

## Reducer Pattern for Complex State

For components with many interrelated state changes, `useReducer` is cleaner than multiple `useState` calls.

### Toast system example

```tsx
type ToastAction =
  | { type: 'ADD'; payload: Toast }
  | { type: 'REMOVE'; payload: string }
  | { type: 'CLEAR' };

function toastReducer(state: Toast[], action: ToastAction): Toast[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'REMOVE':
      return state.filter(t => t.id !== action.payload);
    case 'CLEAR':
      return [];
  }
}

// In the Toast container:
const [toasts, dispatch] = useReducer(toastReducer, []);
```

### Why useReducer over useState?

- **Predictable state transitions** — Every possible state change is enumerated in the reducer
- **Testable** — The reducer is a pure function you can unit test independently
- **Complex interactions** — Combobox has ~8 actions (open, close, select, deselect, filter, navigate, clear, toggle). A reducer keeps this manageable.

---

## 'use client' Directive

### What it means

In Next.js App Router, components are Server Components by default. `'use client'` at the top of a file marks it as a Client Component that runs in the browser.

```tsx
'use client';

import { useState } from 'react'; // useState only works in client components

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
```

### Why preserve it through Rollup?

Rollup normally strips unknown directives. If `'use client'` is removed during bundling, the component will crash when used in a Next.js App Router project because Next.js will try to render it as a Server Component (which can't use hooks).

The `preserveDirectives()` Rollup plugin keeps these directives in the output.

### Which components need it?

Any component that uses:
- `useState`, `useReducer`, `useEffect`, `useRef`
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`window`, `document`)

In astra-ui, the `ThemeContext` and `VariantContext` providers are the primary `'use client'` components. Components themselves inherit client-side rendering from these providers.

---

## Accessibility Patterns

### ARIA roles and properties

```tsx
// Tooltip
<div role="tooltip" id={tooltipId}>Tooltip content</div>
<button aria-describedby={tooltipId}>Hover me</button>

// Modal
<div role="dialog" aria-modal="true" aria-labelledby={titleId}>
  <h2 id={titleId}>Modal Title</h2>
</div>

// Alert
<div role="alert" aria-live="assertive">Error: invalid input</div>
```

### Keyboard navigation

Every interactive component must be keyboard-accessible:

| Component | Keys |
|-----------|------|
| Button | `Enter`, `Space` to activate |
| Modal | `Escape` to close, focus trapped inside |
| Dropdown | `Arrow Up/Down` to navigate, `Enter` to select, `Escape` to close |
| Tabs | `Arrow Left/Right` to switch, `Home/End` for first/last |
| Accordion | `Arrow Up/Down` to navigate headers, `Enter/Space` to toggle |

### Focus management

```tsx
// Auto-focus first focusable element when modal opens
useEffect(() => {
  if (isOpen) {
    const firstFocusable = modalRef.current?.querySelector('button, input, [tabindex]');
    firstFocusable?.focus();
  }
}, [isOpen]);

// Return focus to trigger when modal closes
useEffect(() => {
  if (!isOpen && triggerRef.current) {
    triggerRef.current.focus();
  }
}, [isOpen]);
```

### Testing with jest-axe

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

This catches common a11y issues: missing alt text, invalid ARIA attributes, poor color contrast, missing form labels.

---

## Why Tailwind + CVA Instead of CSS-in-JS

### The alternatives

| Approach | Runtime cost | Bundle size | TypeScript DX |
|----------|-------------|-------------|---------------|
| styled-components | Yes (generates CSS at runtime) | Larger (runtime + styles) | OK |
| Emotion | Yes | Larger | OK |
| CSS Modules | No | Smaller | No variant types |
| **Tailwind + CVA** | **No** | **Smallest** | **Full variant types** |

### Why Tailwind wins for component libraries

**Zero runtime cost.** Tailwind generates CSS at build time. No JavaScript runs to create styles. This matters for a library because you don't want to impose runtime overhead on consumers.

**Predictable bundle size.** Tailwind purges unused classes. The final CSS contains only classes actually used by the components the consumer imports.

**Consumer customization.** Consumers extend `tailwind.config.js` to customize the library's appearance without touching component code. Design tokens (colors, spacing, radii) flow through Tailwind's config.

### Why CVA on top of Tailwind

Tailwind alone has no concept of "variants." CVA adds:
- Type-safe variant definitions
- Default variants
- Compound variants (style applied when multiple variants match)
- `VariantProps<typeof styles>` for automatic prop type extraction

---

## Component Testing Strategy

### The approach: render → interact → assert

```tsx
describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('renders as a link when as="a"', () => {
    render(<Button as="a" href="/home">Home</Button>);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/home');
  });

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Key principles

**Query by role, not by class or test-id.** `screen.getByRole('button')` is what a user (and screen reader) sees. `screen.getByTestId('btn-1')` tests implementation, not behavior.

**Use `userEvent` over `fireEvent`.** `userEvent.click()` simulates a real click (focus → mousedown → mouseup → click). `fireEvent.click()` only dispatches the click event. `userEvent` catches more bugs.

**Test behavior, not implementation.** Don't assert internal state or CSS classes. Assert what the user sees and what happens when they interact.

**Accessibility audits with jest-axe.** Every component should pass `axe()` with no violations. This catches issues you might not think to test manually.
