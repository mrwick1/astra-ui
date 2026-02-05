'use client';
import { useComponentTheme } from '@theme/theme.context';
import { forwardRef, Ref, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { usePropId } from '@utils/usePropId';
import { CheckboxComponent, CheckboxProps } from './Checkbox.types';

const defaultProps: Partial<CheckboxProps> = {
  size: 'md',
};

const Checkbox: CheckboxComponent = forwardRef((props: CheckboxProps, ref?: Ref<HTMLInputElement>) => {
  const theme = useComponentTheme('Checkbox');
  const {
    className = '',
    disabled,
    error,
    label,
    size,
    ...additionalProps
  } = {
    ...defaultProps,
    ...props,
  };

  const classes = useMemo(() => {
    return twMerge(theme({ className, error: !!error, size }));
  }, [theme, className, error, size]);

  const id = usePropId(props.id);

  if (label) {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
        <div className="relative inline-flex items-center justify-center">
          <input
            id={id}
            ref={ref}
            type="checkbox"
            className={classes}
            disabled={disabled}
            aria-invalid={error || undefined}
            {...additionalProps}
          />
          <svg
            className="absolute pointer-events-none text-white opacity-0 peer-checked:opacity-100"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          >
            <path d="M2.5 6L5 8.5L9.5 3.5" />
          </svg>
        </div>
        <span className="text-sm text-fg">{label}</span>
      </label>
    );
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <input
        id={id}
        ref={ref}
        type="checkbox"
        className={classes}
        disabled={disabled}
        aria-invalid={error || undefined}
        {...additionalProps}
      />
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
