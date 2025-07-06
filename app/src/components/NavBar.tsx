'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  bar: {
    display: 'flex',
    padding: '1rem',
    backgroundColor: '#eee',
    gap: '1rem',
  },
  spacer: { flexGrow: 1 },
  link: { color: 'blue', textDecoration: 'none' },
  button: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderStyle: 'none',
    cursor: 'pointer',
    color: 'blue',
  },
});

export function NavBar() {
  const { data: session } = useSession();
  return (
    <nav {...stylex.props(styles.bar)}>
      <Link href="/" {...stylex.props(styles.link)}>Home</Link>
      <div {...stylex.props(styles.spacer)} />
      {session ? (
        <button onClick={() => signOut()} {...stylex.props(styles.button)}>
          Sign out
        </button>
      ) : (
        <Link href="/login" {...stylex.props(styles.link)}>Sign in</Link>
      )}
    </nav>
  );
}
