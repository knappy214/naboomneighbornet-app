import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Simple i18n setup
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          // English translations will go here
        }
      },
      af: {
        translation: {
          // Afrikaans translations will go here
        }
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export { i18n };

export function currentLocale(): "en" | "af" { 
  return i18n.locale === "af" ? "af" : "en"; 
}

export function acceptLanguageHeader(): string {
  return i18n.language === "af" ? "af" : "en";
}
