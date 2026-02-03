import { cva } from 'class-variance-authority';

const base = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'rounded-none',
    'font-medium',
    'transition-colors',
    'duration-150',
    'cursor-pointer',
    'select-none',
    'disabled:opacity-50',
    'disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        solid: ['border', 'border-transparent'],
        outline: ['border', 'bg-transparent'],
        ghost: ['border', 'border-transparent', 'bg-transparent'],
      },
      color: {
        accent: [],
        default: [],
        danger: [],
      },
      size: {
        sm: ['text-sm', 'h-8', 'px-3'],
        md: ['text-sm', 'h-10', 'px-4'],
        lg: ['text-base', 'h-12', 'px-5'],
      },
    },
    compoundVariants: [
      // Solid
      {
        variant: 'solid',
        color: 'accent',
        className: ['bg-accent', 'text-white', 'hover:bg-accent-hover'],
      },
      {
        variant: 'solid',
        color: 'default',
        className: ['bg-surface-raised', 'text-fg', 'border-border', 'hover:bg-surface-overlay'],
      },
      {
        variant: 'solid',
        color: 'danger',
        className: ['bg-status-error', 'text-white', 'hover:bg-status-error/90'],
      },
      // Outline
      {
        variant: 'outline',
        color: 'accent',
        className: ['border-accent', 'text-accent', 'hover:bg-accent-light'],
      },
      {
        variant: 'outline',
        color: 'default',
        className: ['border-border', 'text-fg', 'hover:bg-surface-raised'],
      },
      {
        variant: 'outline',
        color: 'danger',
        className: ['border-status-error', 'text-status-error', 'hover:bg-status-error/10'],
      },
      // Ghost
      {
        variant: 'ghost',
        color: 'accent',
        className: ['text-accent', 'hover:bg-accent-light'],
      },
      {
        variant: 'ghost',
        color: 'default',
        className: ['text-fg-muted', 'hover:bg-surface-raised', 'hover:text-fg'],
      },
      {
        variant: 'ghost',
        color: 'danger',
        className: ['text-status-error', 'hover:bg-status-error/10'],
      },
    ],
  }
);

const buttonStyles = {
  base,
};

export { buttonStyles };
