import { ComponentPropsWithRef, ForwardRefExoticComponent } from 'react';

export type SwitchSize = 'sm' | 'md';

export interface SwitchProps extends Omit<ComponentPropsWithRef<'button'>, 'size' | 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: SwitchSize;
  disabled?: boolean;
  label?: string;
}

export type SwitchComponent = ForwardRefExoticComponent<SwitchProps> & {
  displayName?: string;
};
