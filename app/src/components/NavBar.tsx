'use client'

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
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
      <Link href="/" style={styles.link}>
        Home
      </Link>
      <Link href="/uploaded-work" style={styles.link}>
        Uploaded Work
      </Link>
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
