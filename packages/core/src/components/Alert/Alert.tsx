'use client';
import { AlertProps } from './Alert.types';
import { useComponentTheme } from '@theme/theme.context';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

const defaultProps: Partial<AlertProps> = {
  variant: 'info',
  closable: false,
};

const Alert = (props: AlertProps) => {
  const theme = useComponentTheme('Alert');
  const {
    children,
    className = '',
    closable,
    onClose,
    title,
    variant,
    ...additionalProps
  } = {
    ...defaultProps,
    ...props,
  };

  const classes = useMemo(() => {
    return twMerge(theme({ className, variant }));
  }, [theme, className, variant]);

  return (
    <div role="alert" className={classes} {...additionalProps}>
      <div className="flex-1">
        {title && <p className="font-medium">{title}</p>}
        <div className="text-fg-muted text-sm">{children}</div>
      </div>
      {closable && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-fg-subtle hover:text-fg transition-colors"
          aria-label="Close alert"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

Alert.displayName = 'Alert';

export default Alert;
