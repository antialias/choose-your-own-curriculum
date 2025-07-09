'use client'

import { signIn } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import { css } from '@/styled-system/css';

export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <div className={css({ padding: '2rem', textAlign: 'center' })}>
      <h1>{t('logIn')}</h1>
      <button
        className={css({ padding: '0.5rem 1rem', fontSize: '1rem', cursor: 'pointer' })}
        onClick={() => signIn('email', { callbackUrl: '/' })}
      >
        {t('signInWithEmail')}
      </button>
    </div>
  );
}
