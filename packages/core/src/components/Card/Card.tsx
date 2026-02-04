'use client';
import { forwardRef, Ref } from 'react';
import { twMerge } from 'tailwind-merge';
import { cardStyles } from '@theme/styles/Card.styles';
import { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps, CardComponent } from './Card.types';

const CardRoot = forwardRef((props: CardProps, ref?: Ref<HTMLDivElement>) => {
  const { children, className, ...rest } = props;
  return (
    <div ref={ref} className={twMerge(cardStyles.base(), className)} {...rest}>
      {children}
    </div>
  );
});
CardRoot.displayName = 'Card';

const CardHeader = forwardRef((props: CardHeaderProps, ref?: Ref<HTMLDivElement>) => {
  const { children, className, ...rest } = props;
  return (
    <div ref={ref} className={twMerge(cardStyles.header(), className)} {...rest}>
      {children}
    </div>
  );
});
CardHeader.displayName = 'Card.Header';

const CardBody = forwardRef((props: CardBodyProps, ref?: Ref<HTMLDivElement>) => {
  const { children, className, ...rest } = props;
  return (
    <div ref={ref} className={twMerge(cardStyles.body(), className)} {...rest}>
      {children}
    </div>
  );
});
CardBody.displayName = 'Card.Body';

const CardFooter = forwardRef((props: CardFooterProps, ref?: Ref<HTMLDivElement>) => {
  const { children, className, ...rest } = props;
  return (
    <div ref={ref} className={twMerge(cardStyles.footer(), className)} {...rest}>
      {children}
    </div>
  );
});
CardFooter.displayName = 'Card.Footer';

const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
}) as CardComponent;

export default Card;
