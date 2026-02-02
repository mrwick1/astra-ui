'use client';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { useFormControlContext } from './FormControl.context';

export interface FormLabelProps {
  children: ReactNode;
  className?: string;
}

const FormLabel = ({ children, className }: FormLabelProps) => {
  const { id, required } = useFormControlContext();

  return (
    <label
      htmlFor={id}
      className={twMerge('block text-sm font-medium text-fg mb-1.5', className)}
    >
      {children}
      {required && <span className="text-status-error ml-0.5">*</span>}
    </label>
  );
};

FormLabel.displayName = 'FormLabel';

export default FormLabel;
