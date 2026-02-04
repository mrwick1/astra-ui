import { cva } from 'class-variance-authority';

const base = cva(
  [
    'w-full',
    'rounded-none',
    'bg-surface-raised',
    'border',
    'border-border',
    'text-fg',
    'placeholder:text-fg-subtle',
    'transition-colors',
    'duration-150',
    'outline-none',
    'focus:border-accent',
    'focus:ring-1',
    'focus:ring-accent',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        sm: ['h-8', 'px-3', 'text-sm'],
        md: ['h-10', 'px-3', 'text-sm'],
        lg: ['h-12', 'px-4', 'text-base'],
      },
      error: {
        true: ['border-status-error', 'focus:border-status-error', 'focus:ring-status-error'],
        false: [],
      },
    },
  }
);

const inputStyles = {
  base,
};

export { inputStyles };
