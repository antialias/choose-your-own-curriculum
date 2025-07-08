import Link from 'next/link'
import type { Session } from 'next-auth'
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

export function NavBar({ session }: { session: Session | null }) {
  return (
    <nav style={styles.bar}>
      <Link href="/" style={styles.link}>
        Home
      </Link>
      <Link href="/uploaded-work" style={styles.link}>
        Uploaded Work
      </Link>
      <Link href="/topic-dags" style={styles.link}>
        My Curriculums
      </Link>
      <Link href="/students" style={styles.link}>
        Students
      </Link>
      <div style={styles.spacer} />
      {session ? (
        <form action="/api/auth/signout" method="post">
          <button type="submit" style={styles.button}>
            Sign out
          </button>
        </form>
      ) : (
        <Link href="/login" style={styles.link}>
          Sign in
        </Link>
      )}
    </nav>
  );
}
