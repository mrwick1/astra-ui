'use client';
import { twMerge } from 'tailwind-merge';
import { useFormControlContext } from './FormControl.context';

export interface FormErrorProps {
  className?: string;
}

const FormError = ({ className }: FormErrorProps) => {
  const { id, hasError, errorMessage } = useFormControlContext();

  if (!hasError || !errorMessage) return null;

  return (
    <p
      id={`${id}-error`}
      role="alert"
      className={twMerge('text-sm text-status-error mt-1.5', className)}
    >
      {errorMessage}
    </p>
  );
};

FormError.displayName = 'FormError';

export default FormError;
