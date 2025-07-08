'use client';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import type { i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';

export default function I18nProvider({
  children,
  i18n,
}: {
  children: ReactNode;
  i18n: i18n;
}) {
  useEffect(() => {
    if (!i18n.isInitialized) {
      i18n.use(initReactI18next).init({
        ...(i18n.options as Record<string, unknown>),
        lng: i18n.language,
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
      });
    }
  }, [i18n]);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
