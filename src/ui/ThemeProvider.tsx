import * as eva from '@eva-design/eva';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { ThemeName, themes } from './themes';

type ThemeMode = 'light' | 'dark' | 'system';

interface CustomThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
  currentTheme: ThemeName;
  theme: any;
}

const CustomThemeContext = createContext<CustomThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      if (mode === 'system') {
        const systemIsDark = Appearance.getColorScheme() === 'dark';
        setIsDark(systemIsDark);
        setCurrentTheme(systemIsDark ? 'dark' : 'light');
      } else {
        const isDarkMode = mode === 'dark';
        setIsDark(isDarkMode);
        setCurrentTheme(isDarkMode ? 'dark' : 'light');
      }
    };

    updateTheme();
    setIsInitialized(true);

    if (mode === 'system') {
      const subscription = Appearance.addChangeListener(updateTheme);
      return () => subscription?.remove();
    }
  }, [mode]);

  const theme = themes[currentTheme] || eva.light;

  // Don't render until theme is initialized to prevent undefined errors
  if (!isInitialized) {
    return null;
  }

  return (
    <CustomThemeContext.Provider value={{ mode, setMode, isDark, currentTheme, theme }}>
      {children}
    </CustomThemeContext.Provider>
  );
}

export function useThemeCtx() {
  const context = useContext(CustomThemeContext);
  if (context === undefined) {
    throw new Error('useThemeCtx must be used within a ThemeProvider');
  }
  return context;
}

// Export UI Kitten's useTheme hook for direct theme access
export { useTheme } from '@ui-kitten/components';

