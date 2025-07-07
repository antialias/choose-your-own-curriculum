'use client'

import { signIn } from 'next-auth/react';
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
  return (
    <div style={styles.container}>
      <h1>Log In</h1>
      <button style={styles.button} onClick={() => signIn()}>
        Sign in with Email
      </button>
    </div>
  );
}
