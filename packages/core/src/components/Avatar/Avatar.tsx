'use client';
import { useComponentTheme } from '@theme/theme.context';
import { forwardRef, Ref, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { AvatarComponent, AvatarProps } from './Avatar.types';

const defaultProps: Partial<AvatarProps> = {
  size: 'md',
};

const Avatar: AvatarComponent = forwardRef((props: AvatarProps, ref?: Ref<HTMLDivElement>) => {
  const theme = useComponentTheme('Avatar');
  const { src, alt, size, fallback, className = '', children, ...additionalProps } = {
    ...defaultProps,
    ...props,
  };

  const [imgError, setImgError] = useState(false);
  const showImage = src && !imgError;

  const classes = useMemo(() => {
    return twMerge(theme({ className, size }));
  }, [theme, className, size]);

  const initials = alt
    ? alt
        .split(' ')
        .map((word) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  return (
    <div ref={ref} className={classes} {...additionalProps}>
      {showImage ? (
        <img
          src={src}
          alt={alt || ''}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        fallback || <span className="font-mono text-[0.65em]">{initials}</span>
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;
