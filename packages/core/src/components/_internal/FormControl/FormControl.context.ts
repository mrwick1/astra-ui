'use client';
import { createElementContext } from '@hooks/use-element-context.hook';

export interface FormControlContextValue {
  id: string;
  disabled: boolean;
  required: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export const [FormControlProvider, useFormControlContext] = createElementContext<FormControlContextValue>(
  'FormControl compound components must be used within a <FormControl> parent.'
);
