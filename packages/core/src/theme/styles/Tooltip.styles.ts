import { cva } from 'class-variance-authority';

const base = cva([
  'z-50',
  'px-3',
  'py-1.5',
  'text-sm',
  'bg-fg',
  'text-surface',
  'rounded-none',
  'shadow-md',
  'pointer-events-none',
  'select-none',
]);

const tooltipStyles = { base };

export { tooltipStyles };
