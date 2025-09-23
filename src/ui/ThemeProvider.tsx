import * as eva from '@eva-design/eva';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, Platform } from 'react-native';
import { ThemeName, themes } from './themes';

type ThemeMode = 'light' | 'dark' | 'system';

interface CustomThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
  currentTheme: ThemeName;
  theme: any;
  toggleTheme: () => void;
}

const CustomThemeContext = createContext<CustomThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load theme mode from secure storage on mount
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        // Only use SecureStore on native platforms, fallback to localStorage on web
        if (Platform.OS === 'web') {
          const storedMode = localStorage.getItem(THEME_STORAGE_KEY);
          if (storedMode && ['light', 'dark', 'system'].includes(storedMode)) {
            setMode(storedMode as ThemeMode);
          }
        } else {
          const storedMode = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
          if (storedMode && ['light', 'dark', 'system'].includes(storedMode)) {
            setMode(storedMode as ThemeMode);
          }
        }
      } catch (error) {
        console.warn('Failed to load theme mode from storage:', error);
      }
    };

    loadThemeMode();
  }, []);

  // Save theme mode to secure storage when it changes
  useEffect(() => {
    const saveThemeMode = async () => {
      try {
        // Only use SecureStore on native platforms, fallback to localStorage on web
        if (Platform.OS === 'web') {
          localStorage.setItem(THEME_STORAGE_KEY, mode);
        } else {
          await SecureStore.setItemAsync(THEME_STORAGE_KEY, mode);
        }
      } catch (error) {
        console.warn('Failed to save theme mode to storage:', error);
      }
    };

    if (isInitialized) {
      saveThemeMode();
    }
  }, [mode, isInitialized]);

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

  const toggleTheme = () => {
    if (mode === 'light') {
      setMode('dark');
    } else if (mode === 'dark') {
      setMode('system');
    } else {
      setMode('light');
    }
  };

  const theme = themes[currentTheme] || eva.light;

  // Don't render until theme is initialized to prevent undefined errors
  if (!isInitialized) {
    return null;
  }

  return (
    <CustomThemeContext.Provider value={{ 
      mode, 
      setMode, 
      isDark, 
      currentTheme, 
      theme, 
      toggleTheme 
    }}>
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

