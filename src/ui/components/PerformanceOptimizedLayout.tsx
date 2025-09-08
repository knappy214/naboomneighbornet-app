import { Layout, LayoutProps, useTheme } from '@ui-kitten/components';
import React, { memo } from 'react';

interface PerformanceOptimizedLayoutProps extends LayoutProps {
  children: React.ReactNode;
}

// Memoized layout component to prevent unnecessary re-renders
export const PerformanceOptimizedLayout = memo<PerformanceOptimizedLayoutProps>(({ 
  children, 
  style, 
  ...props 
}) => {
  const theme = useTheme();

  const defaultStyle = {
    backgroundColor: theme?.['color-basic-100'] || '#ffffff',
    flex: 1,
  };

  return (
    <Layout
      {...props}
      style={[defaultStyle, style]}
    >
      {children}
    </Layout>
  );
});

PerformanceOptimizedLayout.displayName = 'PerformanceOptimizedLayout';
