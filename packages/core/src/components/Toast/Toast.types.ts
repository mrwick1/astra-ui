import { ReactNode } from 'react';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastData {
  id: string;
  variant: ToastVariant;
  title?: string;
  description?: string;
  duration?: number;
}

export interface ToastContainerProps {
  className?: string;
}
