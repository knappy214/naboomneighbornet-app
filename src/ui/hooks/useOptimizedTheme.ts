import { useTheme } from '@ui-kitten/components';
import { useMemo } from 'react';

// Optimized hook for theme access with memoization
export const useOptimizedTheme = () => {
  const theme = useTheme();

  return useMemo(() => ({
    // Primary colors
    primary: {
      100: theme['color-primary-100'],
      200: theme['color-primary-200'],
      300: theme['color-primary-300'],
      400: theme['color-primary-400'],
      500: theme['color-primary-500'],
      600: theme['color-primary-600'],
      700: theme['color-primary-700'],
      800: theme['color-primary-800'],
      900: theme['color-primary-900'],
    },
    // Success colors
    success: {
      100: theme['color-success-100'],
      200: theme['color-success-200'],
      300: theme['color-success-300'],
      400: theme['color-success-400'],
      500: theme['color-success-500'],
      600: theme['color-success-600'],
      700: theme['color-success-700'],
      800: theme['color-success-800'],
      900: theme['color-success-900'],
    },
    // Warning colors
    warning: {
      100: theme['color-warning-100'],
      200: theme['color-warning-200'],
      300: theme['color-warning-300'],
      400: theme['color-warning-400'],
      500: theme['color-warning-500'],
      600: theme['color-warning-600'],
      700: theme['color-warning-700'],
      800: theme['color-warning-800'],
      900: theme['color-warning-900'],
    },
    // Danger colors
    danger: {
      100: theme['color-danger-100'],
      200: theme['color-danger-200'],
      300: theme['color-danger-300'],
      400: theme['color-danger-400'],
      500: theme['color-danger-500'],
      600: theme['color-danger-600'],
      700: theme['color-danger-700'],
      800: theme['color-danger-800'],
      900: theme['color-danger-900'],
    },
    // Text colors
    text: {
      basic: theme['text-basic-color'],
      hint: theme['text-hint-color'],
      disabled: theme['text-disabled-color'],
      control: theme['text-control-color'],
    },
    // Background colors
    background: {
      basic: theme['color-basic-100'],
      alternative: theme['color-basic-200'],
      disabled: theme['color-basic-300'],
    },
  }), [theme]);
};
