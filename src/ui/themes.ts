import * as eva from '@eva-design/eva';

// Agricultural Color Palette - Light Theme (community-security)
const lightBrandTheme = {
  ...eva.light,
  // Override only the essential colors
  'color-primary-500': '#6b4f2a', // Land
  'color-primary-600': '#5a4224',
  'color-primary-700': '#49351e',
  'color-primary-800': '#382818',
  'color-primary-900': '#271b12',
  
  'color-success-500': '#3a7d44', // Crop-Green
  'color-success-600': '#2e6336',
  'color-success-700': '#224928',
  'color-success-800': '#162f1a',
  'color-success-900': '#0a150c',
  
  'color-info-500': '#3a7d44', // Crop-Green for info
  'color-info-600': '#2e6336',
  'color-info-700': '#224928',
  'color-info-800': '#162f1a',
  'color-info-900': '#0a150c',
  
  'color-warning-500': '#f6b40e', // Sun-Gold
  'color-warning-600': '#c5900b',
  'color-warning-700': '#946c08',
  'color-warning-800': '#634805',
  'color-warning-900': '#322402',
  
  'color-danger-500': '#c0392b', // Signal-Red
  'color-danger-600': '#9a2e23',
  'color-danger-700': '#74231b',
  'color-danger-800': '#4e1812',
  'color-danger-900': '#280d09',
  
  // Text colors
  'text-basic-color': '#6b4f2a', // Land color for text
  'text-hint-color': '#a8a29e',
  'text-disabled-color': '#d6d3d1',
  'text-control-color': '#ffffff', // Cloud-White for text on colored backgrounds
};

// Agricultural Dark Theme (community-security-dark)
const darkBrandTheme = {
  ...eva.dark,
  // Override only the essential colors
  'color-primary-500': '#8b6f4a', // Lighter Land
  'color-primary-600': '#6b5638',
  'color-primary-700': '#4d3d26',
  'color-primary-800': '#2f2414',
  'color-primary-900': '#110b02',
  
  'color-success-500': '#4a8b5a', // Lighter Crop-Green
  'color-success-600': '#3a6f47',
  'color-success-700': '#2a5334',
  'color-success-800': '#1a3721',
  'color-success-900': '#0a1b0e',
  
  'color-info-500': '#4a8b5a', // Lighter Crop-Green for info
  'color-info-600': '#3a6f47',
  'color-info-700': '#2a5334',
  'color-info-800': '#1a3721',
  'color-info-900': '#0a1b0e',
  
  'color-warning-500': '#f6b40e', // Sun-Gold (same as light)
  'color-warning-600': '#c5900b',
  'color-warning-700': '#946c08',
  'color-warning-800': '#634805',
  'color-warning-900': '#322402',
  
  'color-danger-500': '#e74c3c', // Lighter Signal-Red
  'color-danger-600': '#b93c30',
  'color-danger-700': '#8b2c24',
  'color-danger-800': '#5d1c18',
  'color-danger-900': '#2f0c0c',
  
  // Text colors
  'text-basic-color': '#f5f5f4', // Light earth tone for text
  'text-hint-color': '#8d5f46',
  'text-disabled-color': '#5d3e28',
  'text-control-color': '#2d1b0a', // Dark earth for text on colored backgrounds
};

export const themes = {
  light: lightBrandTheme,
  dark: darkBrandTheme,
};

export type ThemeName = 'light' | 'dark';
