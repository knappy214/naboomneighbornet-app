// Simple i18n implementation without external dependencies
let currentLanguage: 'en' | 'af' = 'en';

export const i18n = {
  locale: currentLanguage,
  language: currentLanguage,
  setLocale: (locale: 'en' | 'af') => {
    currentLanguage = locale;
    (i18n as any).locale = locale;
    (i18n as any).language = locale;
  }
};

export function currentLocale(): "en" | "af" { 
  return currentLanguage; 
}

export function acceptLanguageHeader(): string {
  return currentLanguage;
}
