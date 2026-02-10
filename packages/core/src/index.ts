// Components
export { Badge } from './components/Badge';
export type {
  BadgeProps,
  BadgeColor,
  BadgeRadius,
  BadgeShadow,
  BadgeShadowColor,
  BadgeSize,
  BadgeTone,
  BadgeVariant,
} from './components/Badge';

export { Text } from './components/Text';
export type {
  TextProps,
  TextColor,
  TextSize,
  TextWeight,
  TextLeading,
  TextTracking,
  TextVariant,
} from './components/Text';

export { Spinner } from './components/Spinner';
export type { SpinnerProps } from './components/Spinner';

// Theme
export {
  ThemeProvider,
  useTheme,
  useComponentTheme,
  VariantProvider,
  useVariant,
  useComponentVariant,
} from './theme';
export type { Theme, ThemeContextType } from './theme/theme.context';
export type { Variant, VariantContextType } from './theme/variant.context';

// Types
export type {
  PolymorphicComponentProp,
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
} from './types';

// Hooks
export { useKeypress } from './hooks/use-keypress';
export { useVerticalArrows } from './hooks/use-vertical-arrows.hook';
export { useHorizontalArrows } from './hooks/use-horizontal-arrows.hook';
export { useFocusTrap } from './hooks/use-focus-trap.hook';
export { useIsoMorphicEffect } from './hooks/use-isomorphic-effect';
export { createElementContext } from './hooks/use-element-context.hook';
export { createIndependentContext } from './hooks/use-independent-context.hook';

// Utils
export { toSlug, useIsomorphicLayoutEffect, usePrevious, usePropId } from './utils';

// Animations
export { useFade } from './animations';

// Helpers
export { arrowSideDictionary } from './helpers/arrow-side.dictionary';
export { textNormalize } from './helpers/text-normalize.utility';
