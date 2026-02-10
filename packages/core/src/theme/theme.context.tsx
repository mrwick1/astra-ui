'use client';
import * as styles from './styles';
import { createContext, Provider, useContext } from 'react';

export type Theme = {
  components: ThemeComponents;
};

type ThemeComponents = {
  Spinner: typeof styles.spinnerStyles.base;
  Text: typeof styles.textStyles.base;
};

const defaultTheme: Theme = {
  components: {
    Spinner: styles.spinnerStyles.base,
    Text: styles.textStyles.base,
  },
};

export type ThemeContextType = {
  theme: Theme;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
});

export const ThemeProvider: Provider<ThemeContextType> = ThemeContext.Provider;

export function useTheme(): Theme {
  return useContext(ThemeContext)?.theme || defaultTheme;
}

export function useComponentTheme<C extends keyof ThemeComponents>(component: C) {
  const theme = useTheme();

  return theme.components[component];
}
