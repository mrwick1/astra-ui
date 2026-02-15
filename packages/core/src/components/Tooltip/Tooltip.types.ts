import { ReactNode } from 'react';
import { Placement } from '@floating-ui/react';

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  placement?: Placement;
  delay?: number;
  className?: string;
}
