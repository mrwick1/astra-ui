import { cva } from 'class-variance-authority';

const base = cva(
  [
    'flex',
    'items-start',
    'gap-3',
    'p-4',
    'rounded-none',
    'bg-surface-overlay',
    'border',
    'border-border',
    'shadow-lg',
    'min-w-[320px]',
    'max-w-[420px]',
  ],
  {
    variants: {
      variant: {
        info: [],
        success: [],
        warning: [],
        error: [],
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

const accentBar = cva(['w-1', 'self-stretch', 'shrink-0', 'rounded-none'], {
  variants: {
    variant: {
      info: ['bg-accent'],
      success: ['bg-status-success'],
      warning: ['bg-status-warning'],
      error: ['bg-status-error'],
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

const toastStyles = {
  base,
  accentBar,
};

export { toastStyles };
