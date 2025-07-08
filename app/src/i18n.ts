import i18n, { Resource } from 'i18next';

import en from './locales/en/common.json';
import es from './locales/es/common.json';
import fr from './locales/fr/common.json';

export const resources = {
  en: { common: en },
  es: { common: es },
  fr: { common: fr },
} as const satisfies Resource;

export async function initI18n(lng: string) {
  if (!i18n.isInitialized) {
    if (typeof window !== 'undefined') {
      const { initReactI18next } = await import('react-i18next');
      i18n.use(initReactI18next);
    }
    await i18n.init({
        resources,
        lng,
        fallbackLng: 'en',
        defaultNS: 'common',
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
      });
  } else if (i18n.language !== lng) {
    await i18n.changeLanguage(lng);
  }
  return i18n;
}

export default i18n;
