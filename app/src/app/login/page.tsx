'use client';
import { signIn } from 'next-auth/react';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  container: { padding: '2rem', textAlign: 'center' },
  button: {
    backgroundColor: 'blue',
    color: 'white',
    padding: '0.5rem 1rem',
    borderWidth: 0,
    borderStyle: 'none',
    cursor: 'pointer',
  },
});

export default function LoginPage() {
  return (
    <div {...stylex.props(styles.container)}>
      <h1>Login</h1>
      <button {...stylex.props(styles.button)} onClick={() => signIn()}>
        Sign in with Email
      </button>
    </div>
  );
}
