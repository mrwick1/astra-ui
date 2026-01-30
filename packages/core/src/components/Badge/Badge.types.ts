import { ComponentPropsWithRef, ForwardRefExoticComponent } from 'react';

export type BadgeColor = 'accent' | 'success' | 'warning' | 'error' | 'default';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
export type BadgeTone = 'solid' | 'light' | 'outline';
export type BadgeVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  color?: BadgeColor;
  size?: BadgeSize;
  tone?: BadgeTone;
  variant?: BadgeVariant;
}

export type BadgeComponent = ForwardRefExoticComponent<BadgeProps> & {
  displayName?: string;
};
