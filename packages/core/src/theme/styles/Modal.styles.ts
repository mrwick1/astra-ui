import { cva } from 'class-variance-authority';

const base = cva([
  'fixed',
  'z-50',
  'top-1/2',
  'left-1/2',
  '-translate-x-1/2',
  '-translate-y-1/2',
  'w-full',
  'max-w-lg',
  'bg-surface-raised',
  'border',
  'border-border',
  'rounded-none',
  'shadow-lg',
  'outline-none',
]);

const header = cva([
  'flex',
  'items-center',
  'justify-between',
  'px-6',
  'py-4',
  'border-b',
  'border-border',
]);

const body = cva([
  'px-6',
  'py-4',
]);

const footer = cva([
  'flex',
  'items-center',
  'justify-end',
  'gap-3',
  'px-6',
  'py-4',
  'border-t',
  'border-border',
]);

const modalStyles = { base, header, body, footer };

export { modalStyles };
