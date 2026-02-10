import { useId } from 'react';

export function usePropId(propId?: string | undefined): string {
  const id = useId();
  return propId || id;
}
