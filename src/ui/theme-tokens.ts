/**
 * Theme Tokens - Clean Business Colors for UI Kitten
 * Using direct hex values for a professional, clean-cut business look
 */

/**
 * Light Theme Colors - Clean Business Style
 */
export const lightThemeTokens = {
  // Base colors - Clean whites and grays
  'background-basic-color-1': '#ffffff', // Pure white
  'background-basic-color-2': '#f8f8f8', // Very light gray
  'background-basic-color-3': '#eeeeee', // Light gray
  'text-basic-color': '#18181b', // Dark gray text

  // Brand colors - Professional purple
  'color-primary-500': '#422ad5', // Primary purple
  
  // Status colors - Standard business colors
  'color-info-500': '#4a90e2', // Professional blue
  'color-success-500': '#00d390', // Success green
  'color-warning-500': '#fcb700', // Warning amber
  'color-danger-500': '#ff637d', // Error red
} as const;

/**
 * Dark Theme Colors - Clean Business Style
 */
export const darkThemeTokens = {
  // Base colors - Clean dark grays
  'background-basic-color-1': '#202020', // Dark background
  'background-basic-color-2': '#1c1c1c', // Darker background
  'background-basic-color-3': '#181818', // Darkest background
  'text-basic-color': '#cdcdcd', // Light gray text

  // Brand colors - Professional purple (adjusted for dark)
  'color-primary-500': '#1c4e80',  // Primary purple (lighter for dark theme)
  
  // Status colors - Consistent with light theme
  'color-info-500': '#4a90e2', // Professional blue
  'color-success-500': '#6bb187', // Success green
  'color-warning-500': '#dbae5a', // Warning amber
  'color-danger-500': '#ac3e31', // Error red (softer for dark theme)
} as const;

// Log the theme tokens for debugging
console.log('🎨 Light Theme Tokens:', lightThemeTokens);
console.log('🌙 Dark Theme Tokens:', darkThemeTokens);
