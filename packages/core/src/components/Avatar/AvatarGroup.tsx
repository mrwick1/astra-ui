'use client';
import { Children, ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';
import Avatar from './Avatar';
import { AvatarGroupProps, AvatarProps } from './Avatar.types';

const AvatarGroup = ({ children, max = 5, size = 'md', className }: AvatarGroupProps) => {
  const avatars = Children.toArray(children) as ReactElement<AvatarProps>[];
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={twMerge('inline-flex items-center -space-x-2', className)}>
      {visible.map((avatar, index) => (
        <div key={index} className="relative border-2 border-surface">
          {avatar.props ? (
            <Avatar {...avatar.props} size={size} />
          ) : (
            avatar
          )}
        </div>
      ))}
      {remaining > 0 && (
        <Avatar size={size} className="relative border-2 border-surface bg-surface-overlay text-fg-muted">
          <span className="font-mono text-[0.65em]">+{remaining}</span>
        </Avatar>
      )}
    </div>
  );
};

AvatarGroup.displayName = 'AvatarGroup';

export default AvatarGroup;
