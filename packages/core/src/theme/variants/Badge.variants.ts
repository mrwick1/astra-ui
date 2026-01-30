import { BadgeProps, BadgeVariant } from '@components/Badge/Badge.types';

export const badgeVariants: Record<BadgeVariant, BadgeProps> = {
  primary: {
    color: 'accent',
    tone: 'solid',
  },
  secondary: {
    color: 'default',
    tone: 'solid',
  },
  danger: {
    color: 'error',
    tone: 'solid',
  },
  success: {
    color: 'success',
    tone: 'solid',
  },
  warning: {
    color: 'warning',
    tone: 'solid',
  },
  info: {
    color: 'accent',
    tone: 'light',
  },
};
