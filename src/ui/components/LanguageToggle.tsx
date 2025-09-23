import { Button, Icon } from '@ui-kitten/components';
import React from 'react';
import { useTranslation } from '../../i18n';

interface LanguageToggleProps {
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
  appearance?: 'filled' | 'outline' | 'ghost';
}

export function LanguageToggle({ size = 'small', appearance = 'outline' }: LanguageToggleProps) {
  const { t, locale, setLocale } = useTranslation();

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'af' : 'en');
  };

  const getLanguageDisplay = () => {
    return locale === 'en' ? 'English' : 'Afrikaans';
  };

  return (
    <Button
      size={size}
      appearance={appearance}
      onPress={toggleLanguage}
      accessoryLeft={(props) => <Icon {...(props || {})} name="globe-outline" />}
    >
      {getLanguageDisplay()}
    </Button>
  );
}
