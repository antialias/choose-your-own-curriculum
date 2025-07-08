'use client';
import { PropsWithChildren, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { initI18n } from '@/i18n';

export default function I18nProvider({ lng, children }: PropsWithChildren<{ lng: string }>) {
  const [instance, setInstance] = useState<import('i18next').i18n | undefined>(
    i18n.isInitialized ? i18n : undefined
  );

  useEffect(() => {
    if (!i18n.isInitialized || i18n.language !== lng) {
      initI18n(lng).then((inst) => setInstance(inst));
    }
  }, [lng]);

  if (!instance) return null;

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
