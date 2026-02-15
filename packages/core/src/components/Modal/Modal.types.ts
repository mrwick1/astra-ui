import { ComponentPropsWithRef, ForwardRefExoticComponent, ReactNode } from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

export interface ModalHeaderProps extends ComponentPropsWithRef<'div'> {
  children: ReactNode;
}

export interface ModalBodyProps extends ComponentPropsWithRef<'div'> {
  children: ReactNode;
}

export interface ModalFooterProps extends ComponentPropsWithRef<'div'> {
  children: ReactNode;
}

export type ModalComponent = ((props: ModalProps) => React.ReactElement | null) & {
  displayName?: string;
  Header: ForwardRefExoticComponent<ModalHeaderProps>;
  Body: ForwardRefExoticComponent<ModalBodyProps>;
  Footer: ForwardRefExoticComponent<ModalFooterProps>;
};
