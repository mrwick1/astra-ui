import { ComponentPropsWithRef, ForwardRefExoticComponent, ReactNode } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends ComponentPropsWithRef<'div'> {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  fallback?: ReactNode;
}

export type AvatarComponent = ForwardRefExoticComponent<AvatarProps> & {
  displayName?: string;
};

export interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  size?: AvatarSize;
  className?: string;
}
