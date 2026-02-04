import { ComponentPropsWithRef, ForwardRefExoticComponent, ReactNode } from 'react';

export interface CardProps extends ComponentPropsWithRef<'div'> {
  children: ReactNode;
}

export interface CardHeaderProps extends ComponentPropsWithRef<'div'> {
  children: ReactNode;
}

export interface CardBodyProps extends ComponentPropsWithRef<'div'> {
  children: ReactNode;
}

export interface CardFooterProps extends ComponentPropsWithRef<'div'> {
  children: ReactNode;
}

export type CardComponent = ForwardRefExoticComponent<CardProps> & {
  displayName?: string;
  Header: ForwardRefExoticComponent<CardHeaderProps>;
  Body: ForwardRefExoticComponent<CardBodyProps>;
  Footer: ForwardRefExoticComponent<CardFooterProps>;
};
