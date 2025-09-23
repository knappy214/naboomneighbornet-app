/**
 * Theme Tokens - Convert OKLCH values to hex for UI Kitten
 * Based on the brand colors defined in .cursor/rules/expo.mdc
 */

import Color from 'colorjs.io';

// Helper function to convert OKLCH to hex
function oklchToHex(oklch: string): string {
  try {
    const color = new Color(oklch);
    return color.to('srgb').toString({ format: 'hex' });
  } catch (error) {
    console.warn(`Failed to convert OKLCH ${oklch}:`, error);
    return '#000000'; // Fallback
  }
}

/**
 * Light Theme Colors (OKLCH → Hex)
 */
export const lightThemeTokens = {
  // Base colors
  'color-base-100': oklchToHex('oklch(100% 0 0)'), // Pure white
  'color-base-200': oklchToHex('oklch(98% 0 0)'), // Very light gray
  'color-base-300': oklchToHex('oklch(95% 0 0)'), // Light gray
  'color-base-content': oklchToHex('oklch(21% 0.006 285.885)'), // Dark text

  // Brand colors
  'color-primary': oklchToHex('oklch(45% 0.24 277.023)'), // Primary brand
  'color-primary-content': oklchToHex('oklch(93% 0.034 272.788)'), // Primary text
  'color-secondary': oklchToHex('oklch(65% 0.241 354.308)'), // Secondary brand
  'color-secondary-content': oklchToHex('oklch(94% 0.028 342.258)'), // Secondary text
  'color-accent': oklchToHex('oklch(77% 0.152 181.912)'), // Accent color
  'color-accent-content': oklchToHex('oklch(38% 0.063 188.416)'), // Accent text
  
  // Neutral
  'color-neutral': oklchToHex('oklch(14% 0.005 285.823)'), // Dark neutral
  'color-neutral-content': oklchToHex('oklch(92% 0.004 286.32)'), // Light neutral text

  // Status colors
  'color-info': oklchToHex('oklch(74% 0.16 232.661)'), // Info blue
  'color-info-content': oklchToHex('oklch(29% 0.066 243.157)'), // Info text
  'color-success': oklchToHex('oklch(76% 0.177 163.223)'), // Success green
  'color-success-content': oklchToHex('oklch(37% 0.077 168.94)'), // Success text
  'color-warning': oklchToHex('oklch(82% 0.189 84.429)'), // Warning yellow
  'color-warning-content': oklchToHex('oklch(41% 0.112 45.904)'), // Warning text
  'color-error': oklchToHex('oklch(71% 0.194 13.428)'), // Error red
  'color-error-content': oklchToHex('oklch(27% 0.105 12.094)'), // Error text
} as const;

/**
 * Dark Theme Colors (OKLCH → Hex)
 */
export const darkThemeTokens = {
  // Base colors
  'color-base-100': oklchToHex('oklch(24.353% 0 0)'), // Dark background
  'color-base-200': oklchToHex('oklch(22.648% 0 0)'), // Darker background
  'color-base-300': oklchToHex('oklch(20.944% 0 0)'), // Darkest background
  'color-base-content': oklchToHex('oklch(84.87% 0 0)'), // Light text

  // Brand colors (adjusted for dark theme)
  'color-primary': oklchToHex('oklch(41.703% 0.099 251.473)'), // Primary brand
  'color-primary-content': oklchToHex('oklch(88.34% 0.019 251.473)'), // Primary text
  'color-secondary': oklchToHex('oklch(64.092% 0.027 229.389)'), // Secondary brand
  'color-secondary-content': oklchToHex('oklch(12.818% 0.005 229.389)'), // Secondary text
  'color-accent': oklchToHex('oklch(67.271% 0.167 35.791)'), // Accent color
  'color-accent-content': oklchToHex('oklch(13.454% 0.033 35.791)'), // Accent text
  
  // Neutral
  'color-neutral': oklchToHex('oklch(27.441% 0.013 253.041)'), // Light neutral
  'color-neutral-content': oklchToHex('oklch(85.488% 0.002 253.041)'), // Dark neutral text

  // Status colors
  'color-info': oklchToHex('oklch(62.616% 0.143 240.033)'), // Info blue
  'color-info-content': oklchToHex('oklch(12.523% 0.028 240.033)'), // Info text
  'color-success': oklchToHex('oklch(70.226% 0.094 156.596)'), // Success green
  'color-success-content': oklchToHex('oklch(14.045% 0.018 156.596)'), // Success text
  'color-warning': oklchToHex('oklch(77.482% 0.115 81.519)'), // Warning yellow
  'color-warning-content': oklchToHex('oklch(15.496% 0.023 81.519)'), // Warning text
  'color-error': oklchToHex('oklch(51.61% 0.146 29.674)'), // Error red
  'color-error-content': oklchToHex('oklch(90.322% 0.029 29.674)'), // Error text
} as const;

// Log the converted colors for debugging
console.log('🎨 Light Theme Tokens:', lightThemeTokens);
console.log('🌙 Dark Theme Tokens:', darkThemeTokens);
