import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      if (mode === 'system') {
        setIsDark(Appearance.getColorScheme() === 'dark');
      } else {
        setIsDark(mode === 'dark');
      }
    };

    updateTheme();

    if (mode === 'system') {
      const subscription = Appearance.addChangeListener(updateTheme);
      return () => subscription?.remove();
    }
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeCtx() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeCtx must be used within a ThemeProvider');
  }
  return context;
}
