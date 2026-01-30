import { cva } from 'class-variance-authority';

const base = cva(['inline-flex', 'items-center', 'text-center', 'rounded-none'], {
  variants: {
    tone: {
      solid: ['border', 'border-transparent'],
      light: [],
      outline: ['border', 'bg-transparent'],
    },
    color: {
      accent: [],
      success: [],
      warning: [],
      error: [],
      default: [],
    },
    size: {
      xs: ['text-xs', 'px-1', 'h-5'],
      sm: ['text-sm', 'px-1.5', 'h-6'],
      md: ['text-base', 'px-1.5', 'h-7'],
      lg: ['text-lg', 'px-2', 'h-8'],
    },
  },
  compoundVariants: [
    // Solid
    {
      tone: 'solid',
      color: 'accent',
      className: ['text-white', 'bg-accent'],
    },
    {
      tone: 'solid',
      color: 'success',
      className: ['text-white', 'bg-status-success'],
    },
    {
      tone: 'solid',
      color: 'warning',
      className: ['text-surface', 'bg-status-warning'],
    },
    {
      tone: 'solid',
      color: 'error',
      className: ['text-white', 'bg-status-error'],
    },
    {
      tone: 'solid',
      color: 'default',
      className: ['text-fg', 'bg-surface-raised'],
    },
    // Light
    {
      tone: 'light',
      color: 'accent',
      className: ['text-accent', 'bg-accent-light'],
    },
    {
      tone: 'light',
      color: 'success',
      className: ['text-status-success', 'bg-status-success/10'],
    },
    {
      tone: 'light',
      color: 'warning',
      className: ['text-status-warning', 'bg-status-warning/10'],
    },
    {
      tone: 'light',
      color: 'error',
      className: ['text-status-error', 'bg-status-error/10'],
    },
    {
      tone: 'light',
      color: 'default',
      className: ['text-fg-muted', 'bg-surface-raised'],
    },
    // Outline
    {
      tone: 'outline',
      color: 'accent',
      className: ['text-accent', 'border-accent'],
    },
    {
      tone: 'outline',
      color: 'success',
      className: ['text-status-success', 'border-status-success'],
    },
    {
      tone: 'outline',
      color: 'warning',
      className: ['text-status-warning', 'border-status-warning'],
    },
    {
      tone: 'outline',
      color: 'error',
      className: ['text-status-error', 'border-status-error'],
    },
    {
      tone: 'outline',
      color: 'default',
      className: ['text-fg-muted', 'border-border'],
    },
  ],
});

const badgeStyles = {
  base,
};

export { badgeStyles };
