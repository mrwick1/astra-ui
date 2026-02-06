import { cva } from 'class-variance-authority';

const trigger = cva(
  [
    'w-full',
    'rounded-none',
    'bg-surface-raised',
    'border',
    'border-border',
    'text-fg',
    'transition-colors',
    'duration-150',
    'outline-none',
    'cursor-pointer',
    'flex',
    'items-center',
    'justify-between',
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

const dropdown = cva([
  'bg-surface-overlay',
  'border',
  'border-border',
  'rounded-none',
  'py-1',
  'shadow-lg',
  'z-50',
  'max-h-60',
  'overflow-auto',
]);

const option = cva(
  [
    'px-3',
    'py-2',
    'text-sm',
    'cursor-pointer',
    'flex',
    'items-center',
    'justify-between',
    'transition-colors',
    'duration-100',
  ],
  {
    variants: {
      active: {
        true: ['bg-accent-light', 'text-fg'],
        false: ['text-fg-muted', 'hover:bg-surface-raised'],
      },
      selected: {
        true: ['text-accent'],
        false: [],
      },
      disabled: {
        true: ['opacity-50', 'cursor-not-allowed'],
        false: [],
      },
    },
  }
);

const selectStyles = {
  trigger,
  dropdown,
  option,
};

export { selectStyles };
