'use client';
import { forwardRef, Ref, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { SwitchComponent, SwitchProps } from './Switch.types';

const sizeMap = {
  sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
  md: { track: 'w-11 h-6', thumb: 'w-4 h-4', translate: 'translate-x-5' },
};

const Switch: SwitchComponent = forwardRef((props: SwitchProps, ref?: Ref<HTMLButtonElement>) => {
  const {
    checked: controlledChecked,
    defaultChecked = false,
    onChange,
    size = 'md',
    disabled = false,
    label,
    className,
    'aria-label': ariaLabel,
    ...additionalProps
  } = props;

  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  };

  const s = sizeMap[size];

  const track = twMerge(
    'relative inline-flex shrink-0 cursor-pointer rounded-none border border-border transition-colors duration-150',
    s.track,
    checked ? 'bg-accent border-accent' : 'bg-surface-raised',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  const thumb = twMerge(
    'absolute top-1/2 -translate-y-1/2 left-0.5 bg-fg rounded-none transition-transform duration-150',
    s.thumb,
    checked && s.translate
  );

  const element = (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel || label}
      disabled={disabled}
      className={track}
      onClick={handleToggle}
      {...additionalProps}
    >
      <span className={thumb} />
    </button>
  );

  if (label) {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
        {element}
        <span className="text-sm text-fg">{label}</span>
      </label>
    );
  }

  return element;
});

Switch.displayName = 'Switch';

export default Switch;
