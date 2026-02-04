import { cva } from 'class-variance-authority';

const base = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-none',
    'bg-surface-raised',
    'border',
    'border-border',
    'overflow-hidden',
    'shrink-0',
    'text-fg-muted',
    'font-medium',
    'select-none',
  ],
  {
    variants: {
      size: {
        xs: ['w-6', 'h-6', 'text-xs'],
        sm: ['w-8', 'h-8', 'text-sm'],
        md: ['w-10', 'h-10', 'text-sm'],
        lg: ['w-12', 'h-12', 'text-base'],
        xl: ['w-14', 'h-14', 'text-lg'],
      },
    },
  }
);

const avatarStyles = {
  base,
};

export { avatarStyles };
