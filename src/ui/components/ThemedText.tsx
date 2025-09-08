import { Text, TextProps, useTheme } from '@ui-kitten/components';
import React from 'react';

interface ThemedTextProps extends TextProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'hint' | 'disabled';
}

export const ThemedText: React.FC<ThemedTextProps> = ({ 
  variant = 'primary', 
  style, 
  children,
  ...props 
}) => {
  const theme = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return { color: theme['color-primary-500'] };
      case 'secondary':
        return { color: theme['color-success-500'] };
      case 'success':
        return { color: theme['color-success-500'] };
      case 'warning':
        return { color: theme['color-warning-500'] };
      case 'danger':
        return { color: theme['color-danger-500'] };
      case 'hint':
        return { color: theme['text-hint-color'] };
      case 'disabled':
        return { color: theme['text-disabled-color'] };
      default:
        return { color: theme['text-basic-color'] };
    }
  };

  return (
    <Text
      {...props}
      style={[getVariantStyle(), style]}
    >
      {children}
    </Text>
  );
};
