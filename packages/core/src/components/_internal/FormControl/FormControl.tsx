'use client';
import { ReactNode, useId } from 'react';
import { FormControlProvider, FormControlContextValue } from './FormControl.context';

export interface FormControlProps {
  children: ReactNode;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}

const FormControl = ({
  children,
  id: idProp,
  disabled = false,
  required = false,
  error,
  className,
}: FormControlProps) => {
  const autoId = useId();
  const id = idProp || autoId;

  const value: FormControlContextValue = {
    id,
    disabled,
    required,
    hasError: !!error,
    errorMessage: error,
  };

  return (
    <FormControlProvider value={value}>
      <div className={className} role="group">
        {children}
      </div>
    </FormControlProvider>
  );
};

FormControl.displayName = 'FormControl';

export default FormControl;
