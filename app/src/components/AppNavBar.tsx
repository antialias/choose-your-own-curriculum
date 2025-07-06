'use client';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

const styles = stylex.create({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f0f0f0',
  },
  links: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: 'black',
  },
});

export function AppNavBar() {
  const sessionData = useSession();
  const session = sessionData ? sessionData.data : null;

  return (
    <nav {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.links)}>
        <Link href="/" {...stylex.props(styles.link)}>
          Home
        </Link>
        <Link href="/login" {...stylex.props(styles.link)}>
          Login
        </Link>
      </div>
      {session ? (
        <button onClick={() => signOut()}>Sign out</button>
      ) : (
        <button onClick={() => signIn()}>Sign in</button>
      )}
    </nav>
  );
}
