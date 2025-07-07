export type UserProfileProps = {
  name: string
  bio: string
}

const styles = {
  root: {
    padding: '1rem',
    textAlign: 'center' as const,
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 'bold' as const,
  },
}

export function UserProfile({ name, bio }: UserProfileProps) {
  return (
    <div style={styles.root}>
      <h2 style={styles.heading}>{name}</h2>
      <p>{bio}</p>
    </div>
  )
}
