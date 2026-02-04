'use client';
import { useComponentTheme } from '@theme/theme.context';
import { forwardRef, Ref, useContext, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { InputComponent, InputProps } from './Input.types';

const defaultProps: Partial<InputProps> = {
  size: 'md',
};

const Input: InputComponent = forwardRef((props: InputProps, ref?: Ref<HTMLInputElement>) => {
  const theme = useComponentTheme('Input');
  const {
    className = '',
    disabled,
    error,
    leftElement,
    rightElement,
    size,
    ...additionalProps
  } = {
    ...defaultProps,
    ...props,
  };

  const classes = useMemo(() => {
    return twMerge(
      theme({
        className: leftElement ? 'pl-10' : rightElement ? 'pr-10' : '',
        error: !!error,
        size,
      }),
      className
    );
  }, [theme, className, error, leftElement, rightElement, size]);

  if (leftElement || rightElement) {
    return (
      <div className="relative">
        {leftElement && (
          <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 pointer-events-none text-fg-subtle">
            {leftElement}
          </div>
        )}
        <input
          ref={ref}
          className={classes}
          disabled={disabled}
          aria-invalid={error || undefined}
          {...additionalProps}
        />
        {rightElement && (
          <div className="absolute right-0 top-0 bottom-0 flex items-center pr-3 pointer-events-none text-fg-subtle">
            {rightElement}
          </div>
        )}
      </div>
    );
  }

  return (
    <input
      ref={ref}
      className={classes}
      disabled={disabled}
      aria-invalid={error || undefined}
      {...additionalProps}
    />
  );
});

Input.displayName = 'Input';

export default Input;
