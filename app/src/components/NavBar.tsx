'use client'

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { navItems } from '@/navItems';
import { useTranslation } from 'react-i18next';
const styles = {
  bar: {
    display: 'flex',
    padding: '1rem',
    backgroundColor: '#eee',
    gap: '1rem',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  spacer: {
    flexGrow: 1,
  },
  button: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
    font: 'inherit',
    color: 'inherit',
  },
};

export function NavBar() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  return (
    <nav style={styles.bar}>
      <Link href="/" style={styles.link}>
        {t('home')}
      </Link>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} style={styles.link}>
          {t(item.label)}
        </Link>
      ))}
      <div style={styles.spacer} />
      {session ? (
        <button style={styles.button} onClick={() => signOut()}>
          {t('signOut')}
        </button>
      ) : (
        <Link href="/login" style={styles.link}>
          {t('signIn')}
        </Link>
      )}
    </nav>
  );
}
