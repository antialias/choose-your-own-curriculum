'use client'

import { signIn } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center' as const,
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <div style={styles.container}>
      <h1>{t('login.title')}</h1>
      <button style={styles.button} onClick={() => signIn()}>
        {t('login.signin')}
      </button>
    </div>
  );
}
