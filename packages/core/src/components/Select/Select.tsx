'use client';
import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
  offset,
  flip,
  shift,
  FloatingPortal,
} from '@floating-ui/react';
import { forwardRef, Ref, useCallback, useMemo, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { usePropId } from '@utils/usePropId';
import { selectStyles } from '@theme/styles/Select.styles';
import { SelectComponent, SelectProps } from './Select.types';

const Select: SelectComponent = forwardRef((props: SelectProps, ref?: Ref<HTMLButtonElement>) => {
  const {
    options,
    value: controlledValue,
    defaultValue,
    onChange,
    placeholder = 'Select…',
    size = 'md',
    disabled = false,
    error = false,
    className,
    ...additionalProps
  } = props;

  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    middleware: [offset(4), flip(), shift()],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const selectedOption = options.find((opt) => opt.value === value);
  const id = usePropId(props.id);

  const handleSelect = useCallback(
    (optValue: string) => {
      if (!isControlled) setInternalValue(optValue);
      onChange?.(optValue);
      setOpen(false);
    },
    [isControlled, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return;
      const enabledOptions = options.filter((o) => !o.disabled);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, enabledOptions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        handleSelect(enabledOptions[activeIndex].value);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    },
    [open, options, activeIndex, handleSelect]
  );

  const triggerClasses = useMemo(() => {
    return twMerge(selectStyles.trigger({ size, error }), className);
  }, [size, error, className]);

  return (
    <>
      <button
        id={id}
        ref={(node) => {
          refs.setReference(node);
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={error || undefined}
        disabled={disabled}
        className={triggerClasses}
        onKeyDown={handleKeyDown}
        {...getReferenceProps()}
        {...additionalProps}
      >
        <span className={selectedOption ? 'text-fg' : 'text-fg-subtle'}>
          {selectedOption?.label || placeholder}
        </span>
        <svg
          className={twMerge('w-4 h-4 text-fg-subtle transition-transform', open && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="square" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <FloatingPortal>
          <div
            ref={(node) => {
              refs.setFloating(node);
              (listRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }}
            role="listbox"
            style={{ ...floatingStyles, width: refs.reference.current?.getBoundingClientRect().width }}
            className={selectStyles.dropdown()}
            {...getFloatingProps()}
          >
            {options.map((opt, index) => {
              const isActive = index === activeIndex;
              const isSelected = opt.value === value;

              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled || undefined}
                  className={selectStyles.option({
                    active: isActive,
                    selected: isSelected,
                    disabled: !!opt.disabled,
                  })}
                  onClick={() => !opt.disabled && handleSelect(opt.value)}
                  onMouseEnter={() => !opt.disabled && setActiveIndex(index)}
                >
                  {opt.label}
                  {isSelected && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="square" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </FloatingPortal>
      )}
    </>
  );
});

Select.displayName = 'Select';

export default Select;
