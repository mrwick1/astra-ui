'use client';
import { createContext, Provider, useContext } from 'react';

export type Variant = {
  components: VariantComponents;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type VariantComponents = {};

const defaultVariant: Variant = {
  components: {},
};

export type VariantContextType = {
  variant: Variant;
};

const VariantContext = createContext<VariantContextType>({
  variant: defaultVariant,
});

export const VariantProvider: Provider<VariantContextType> = VariantContext.Provider;

export function useVariant(): Variant {
  return useContext(VariantContext)?.variant || defaultVariant;
}

export function useComponentVariant<C extends keyof VariantComponents>(
  component: C,
  componentVariant?: keyof VariantComponents[C]
) {
  const variant = useVariant();

  if (!componentVariant) {
    return {};
  }

  return variant.components[component][componentVariant];
}
