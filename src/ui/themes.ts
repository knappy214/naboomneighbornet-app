import * as eva from '@eva-design/eva';
import { darkThemeTokens, lightThemeTokens } from './theme-tokens';

// Light Theme - Using properly converted OKLCH color tokens
const lightBrandTheme = {
  ...eva.light,
  // Base colors - UI Kitten required overrides
  'background-basic-color-1': lightThemeTokens['color-base-100'],
  'background-basic-color-2': lightThemeTokens['color-base-200'],
  'background-basic-color-3': lightThemeTokens['color-base-300'],
  'text-basic-color': lightThemeTokens['color-base-content'],
  
  // Primary colors - UI Kitten required overrides
  'color-primary-500': lightThemeTokens['color-primary'],
  'color-primary-default': lightThemeTokens['color-primary'],
  
  // Status colors - UI Kitten required overrides
  'color-info-500': lightThemeTokens['color-info'],
  'color-success-500': lightThemeTokens['color-success'],
  'color-warning-500': lightThemeTokens['color-warning'],
  'color-danger-500': lightThemeTokens['color-error'],
};

// Dark Theme - Using properly converted OKLCH color tokens
const darkBrandTheme = {
  ...eva.dark,
  // Base colors - UI Kitten required overrides
  'background-basic-color-1': darkThemeTokens['color-base-100'],
  'background-basic-color-2': darkThemeTokens['color-base-200'],
  'background-basic-color-3': darkThemeTokens['color-base-300'],
  'text-basic-color': darkThemeTokens['color-base-content'],
  
  // Primary colors - UI Kitten required overrides
  'color-primary-500': darkThemeTokens['color-primary'],
  'color-primary-default': darkThemeTokens['color-primary'],
  
  // Status colors - UI Kitten required overrides
  'color-info-500': darkThemeTokens['color-info'],
  'color-success-500': darkThemeTokens['color-success'],
  'color-warning-500': darkThemeTokens['color-warning'],
  'color-danger-500': darkThemeTokens['color-error'],
};

export const themes = {
  light: lightBrandTheme,
  dark: darkBrandTheme,
};

export type ThemeName = 'light' | 'dark';
