import * as eva from '@eva-design/eva';
import { darkThemeTokens, lightThemeTokens } from './theme-tokens';

// Light Theme - Clean Business Colors
const lightBrandTheme = {
  ...eva.light,
  // Base colors - UI Kitten required overrides
  'background-basic-color-1': lightThemeTokens['background-basic-color-1'],
  'background-basic-color-2': lightThemeTokens['background-basic-color-2'],
  'background-basic-color-3': lightThemeTokens['background-basic-color-3'],
  'text-basic-color': lightThemeTokens['text-basic-color'],
  
  // Primary colors - UI Kitten required overrides
  'color-primary-500': lightThemeTokens['color-primary-500'],
  'color-primary-default': lightThemeTokens['color-primary-500'],
  
  // Status colors - UI Kitten required overrides
  'color-info-500': lightThemeTokens['color-info-500'],
  'color-success-500': lightThemeTokens['color-success-500'],
  'color-warning-500': lightThemeTokens['color-warning-500'],
  'color-danger-500': lightThemeTokens['color-danger-500'],
};

// Dark Theme - Clean Business Colors
const darkBrandTheme = {
  ...eva.dark,
  // Base colors - UI Kitten required overrides
  'background-basic-color-1': darkThemeTokens['background-basic-color-1'],
  'background-basic-color-2': darkThemeTokens['background-basic-color-2'],
  'background-basic-color-3': darkThemeTokens['background-basic-color-3'],
  'text-basic-color': darkThemeTokens['text-basic-color'],
  
  // Primary colors - UI Kitten required overrides
  'color-primary-500': darkThemeTokens['color-primary-500'],
  'color-primary-default': darkThemeTokens['color-primary-500'],
  
  // Status colors - UI Kitten required overrides
  'color-info-500': darkThemeTokens['color-info-500'],
  'color-success-500': darkThemeTokens['color-success-500'],
  'color-warning-500': darkThemeTokens['color-warning-500'],
  'color-danger-500': darkThemeTokens['color-danger-500'],
};

export const themes = {
  light: lightBrandTheme,
  dark: darkBrandTheme,
};

export type ThemeName = 'light' | 'dark';
