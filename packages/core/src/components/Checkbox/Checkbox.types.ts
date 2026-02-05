import { ComponentPropsWithRef, ForwardRefExoticComponent } from 'react';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'size' | 'type'> {
  size?: CheckboxSize;
  label?: string;
  error?: boolean;
}

export type CheckboxComponent = ForwardRefExoticComponent<CheckboxProps> & {
  displayName?: string;
};
