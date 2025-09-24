import { Button, ButtonProps, useTheme } from '@ui-kitten/components';
import React from 'react';

interface ThemedButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({ 
  variant = 'primary', 
  style, 
  ...props 
}) => {
  const theme = useTheme();

  const getVariantStyle = () => {
    if (!theme) return {};
    
    switch (variant) {
      case 'primary':
        return { backgroundColor: theme['color-primary-500'] || '#6b3aa0' };
      case 'secondary':
        return { backgroundColor: theme['color-success-500'] || '#7cb342' };
      case 'success':
        return { backgroundColor: theme['color-success-500'] || '#7cb342' };
      case 'warning':
        return { backgroundColor: theme['color-warning-500'] || '#ffb300' };
      case 'danger':
        return { backgroundColor: theme['color-danger-500'] || '#e53e3e' };
      default:
        return {};
    }
  };

  return (
    <Button
      {...props}
      style={[getVariantStyle(), style]}
    />
  );
};
