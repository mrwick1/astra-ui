// Components
export { Alert } from './components/Alert';
export type { AlertProps, AlertVariant } from './components/Alert';

export { Avatar, AvatarGroup } from './components/Avatar';
export type { AvatarProps, AvatarGroupProps, AvatarSize } from './components/Avatar';

export { Badge } from './components/Badge';
export type {
  BadgeProps,
  BadgeColor,
  BadgeSize,
  BadgeTone,
  BadgeVariant,
} from './components/Badge';

export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonColor, ButtonSize } from './components/Button';

export { Card } from './components/Card';
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps } from './components/Card';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps, CheckboxSize } from './components/Checkbox';

export { Input } from './components/Input';
export type { InputProps, InputSize } from './components/Input';

export { Select } from './components/Select';
export type { SelectProps, SelectOption, SelectSize } from './components/Select';

export { Switch } from './components/Switch';
export type { SwitchProps, SwitchSize } from './components/Switch';

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

export { ToastContainer, toast } from './components/Toast';
export type { ToastData, ToastVariant, ToastContainerProps } from './components/Toast';

export { Tooltip } from './components/Tooltip';
export type { TooltipProps } from './components/Tooltip';

export { Spinner } from './components/Spinner';
export type { SpinnerProps } from './components/Spinner';

// FormControl (exported for use with form components)
export {
  FormControl,
  FormLabel,
  FormError,
} from './components/_internal/FormControl';
export type { FormControlProps, FormLabelProps, FormErrorProps } from './components/_internal/FormControl';

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
export { useIsomorphicLayoutEffect } from './hooks/use-isomorphic-effect';
export { createElementContext } from './hooks/use-element-context.hook';
export { createIndependentContext } from './hooks/use-independent-context.hook';

// Utils
export { toSlug, usePrevious, usePropId } from './utils';

// Animations
export { useFade } from './animations';

// Helpers
export { arrowSideDictionary } from './helpers/arrow-side.dictionary';
export { textNormalize } from './helpers/text-normalize.utility';
