import { ComponentPropsWithRef, ForwardRefExoticComponent, ReactNode } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  size?: InputSize;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  error?: boolean;
}

export type InputComponent = ForwardRefExoticComponent<InputProps> & {
  displayName?: string;
};
