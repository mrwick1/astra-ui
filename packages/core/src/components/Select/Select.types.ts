import { ForwardRefExoticComponent } from 'react';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: SelectSize;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  id?: string;
}

export type SelectComponent = ForwardRefExoticComponent<SelectProps> & {
  displayName?: string;
};
