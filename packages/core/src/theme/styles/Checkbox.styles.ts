import { cva } from 'class-variance-authority';

const base = cva(
  [
    'appearance-none',
    'rounded-none',
    'border',
    'border-border',
    'bg-surface-raised',
    'cursor-pointer',
    'transition-colors',
    'duration-150',
    'checked:bg-accent',
    'checked:border-accent',
    'focus:outline-none',
    'focus:ring-1',
    'focus:ring-accent',
    'focus:ring-offset-0',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        sm: ['w-4', 'h-4'],
        md: ['w-5', 'h-5'],
        lg: ['w-6', 'h-6'],
      },
      error: {
        true: ['border-status-error'],
        false: [],
      },
    },
  }
);

const checkboxStyles = {
  base,
};

export { checkboxStyles };
