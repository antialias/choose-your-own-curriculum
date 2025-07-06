'use client'

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
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
});

export function NavBar() {
  const { data: session } = useSession();
  return (
    <nav {...stylex.props(styles.bar)}>
      <Link href="/" {...stylex.props(styles.link)}>
        Home
      </Link>
      <div {...stylex.props(styles.spacer)} />
      {session ? (
        <button {...stylex.props(styles.button)} onClick={() => signOut()}>
          Sign out
        </button>
      ) : (
        <Link href="/login" {...stylex.props(styles.link)}>
          Sign in
        </Link>
      )}
    </nav>
  );
}
