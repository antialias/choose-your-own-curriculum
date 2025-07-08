import { createInstance, i18n } from 'i18next';
import translationEn from './locales/en/translation.json';
import translationEs from './locales/es/translation.json';
import translationFr from './locales/fr/translation.json';

const resources = {
  en: { translation: translationEn },
  es: { translation: translationEs },
  fr: { translation: translationFr },
};

export async function initI18next(locale: string): Promise<i18n> {
  const instance = createInstance();
  if (typeof window !== 'undefined') {
    const { initReactI18next } = await import('react-i18next');
    instance.use(initReactI18next);
  }
  await instance.init({
    resources,
    lng: locale,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
  return instance;
}
