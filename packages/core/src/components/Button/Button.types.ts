import { ElementType, ReactElement, ReactNode } from 'react';
import { PolymorphicComponentPropWithRef } from '@types';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonColor = 'accent' | 'default' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

type PolymorphicButtonProps<C extends ElementType> = PolymorphicComponentPropWithRef<C, ButtonProps>;

type PolymorphicButtonComponent = <C extends ElementType = 'button'>(
  props: PolymorphicButtonProps<C>
) => ReactElement | null;

export type ButtonComponent = PolymorphicButtonComponent & { displayName?: string };
