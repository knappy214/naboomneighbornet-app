import { Button, Icon } from '@ui-kitten/components';
import React from 'react';
import { useTranslation } from '../../i18n';
import { useThemeCtx } from '../ThemeProvider';

interface ThemeToggleProps {
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
  appearance?: 'filled' | 'outline' | 'ghost';
}

export function ThemeToggle({ size = 'small', appearance = 'outline' }: ThemeToggleProps) {
  const { t } = useTranslation();
  const { mode, toggleTheme } = useThemeCtx();

  const getIconName = () => {
    switch (mode) {
      case 'light':
        return 'sun-outline';
      case 'dark':
        return 'moon-outline';
      case 'system':
        return 'settings-outline';
      default:
        return 'settings-outline';
    }
  };

  return (
    <Button
      size={size}
      appearance={appearance}
      onPress={toggleTheme}
      accessoryLeft={(props) => <Icon {...(props || {})} name={getIconName()} />}
    >
      {t(`common.${mode}`)}
    </Button>
  );
}
