import { cva } from 'class-variance-authority';

const base = cva([
  'rounded-none',
  'bg-surface-raised',
  'border',
  'border-border',
]);

const header = cva([
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
  'px-6',
  'py-4',
  'border-t',
  'border-border',
]);

const cardStyles = {
  base,
  header,
  body,
  footer,
};

export { cardStyles };
