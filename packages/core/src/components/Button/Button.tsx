'use client';
import { useComponentTheme } from '@theme/theme.context';
import { usePropId } from '@utils/usePropId';
import { ElementType, forwardRef, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { PolymorphicComponentProp, PolymorphicRef } from '../../types';
import Spinner from '../Spinner/Spinner';
import { ButtonComponent, ButtonProps } from './Button.types';

const defaultProps: Partial<ButtonProps> = {
  variant: 'solid',
  color: 'accent',
  size: 'md',
};

const Button: ButtonComponent = forwardRef(
  <C extends ElementType = 'button'>(
    props: PolymorphicComponentProp<C, ButtonProps>,
    ref?: PolymorphicRef<C>
  ) => {
    const theme = useComponentTheme('Button');
    const {
      as,
      children,
      className = '',
      color,
      disabled,
      leftIcon,
      loading,
      rightIcon,
      size,
      variant,
      ...additionalProps
    } = {
      ...defaultProps,
      ...props,
    };

    const classes = useMemo(() => {
      return twMerge(
        theme({
          className,
          color,
          size,
          variant,
        })
      );
    }, [theme, className, color, size, variant]);

    const Component = as || 'button';
    const id = usePropId(props.id);
    const isDisabled = disabled || loading;

    return (
      <Component
        id={id}
        ref={ref}
        className={classes}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...additionalProps}
      >
        {loading ? (
          <Spinner size="xs" color="white" />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export default Button;
