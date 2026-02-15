import { cva } from 'class-variance-authority';

const base = cva(
  ['flex', 'gap-3', 'p-4', 'border-l-4', 'rounded-none', 'bg-surface-raised', 'border', 'border-border'],
  {
    variants: {
      variant: {
        info: ['border-l-accent', 'text-fg'],
        success: ['border-l-status-success', 'text-fg'],
        warning: ['border-l-status-warning', 'text-fg'],
        error: ['border-l-status-error', 'text-fg'],
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

const alertStyles = {
  base,
};

export { alertStyles };
