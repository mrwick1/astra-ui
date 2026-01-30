import { ComponentPropsWithRef } from 'react';

export interface SpinnerProps extends ComponentPropsWithRef<'svg'> {
  color?: 'accent' | 'default' | 'white';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
