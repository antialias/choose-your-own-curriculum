'use client'

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { navItems } from '@/navItems';
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
  return (
    <nav style={styles.bar}>
      {navItems.map((n) => (
        <Link key={n.href} href={n.href} style={styles.link}>
          {n.label}
        </Link>
      ))}
      <div style={styles.spacer} />
      {session ? (
        <button style={styles.button} onClick={() => signOut()}>
          Sign out
        </button>
      ) : (
        <Link href="/login" style={styles.link}>
          Sign in
        </Link>
      )}
    </nav>
  );
}
