import { Card, CardProps, useTheme } from '@ui-kitten/components';
import React from 'react';

interface ThemedCardProps extends CardProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export const ThemedCard: React.FC<ThemedCardProps> = ({ 
  variant = 'default', 
  style, 
  children,
  ...props 
}) => {
  const theme = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return { 
          backgroundColor: theme['color-primary-100'],
          borderColor: theme['color-primary-300'],
        };
      case 'success':
        return { 
          backgroundColor: theme['color-success-100'],
          borderColor: theme['color-success-300'],
        };
      case 'warning':
        return { 
          backgroundColor: theme['color-warning-100'],
          borderColor: theme['color-warning-300'],
        };
      case 'danger':
        return { 
          backgroundColor: theme['color-danger-100'],
          borderColor: theme['color-danger-300'],
        };
      default:
        return {};
    }
  };

  return (
    <Card
      {...props}
      style={[getVariantStyle(), style]}
    >
      {children}
    </Card>
  );
};
