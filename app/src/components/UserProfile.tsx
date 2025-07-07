import { css } from '@/styled-system/css'

export type UserProfileProps = {
  name: string
  bio: string
}

export function UserProfile({ name, bio }: UserProfileProps) {
  return (
    <div className={css({ padding: '4', textAlign: 'center' })}>
      <h2 className={css({ fontSize: '2xl', fontWeight: 'bold' })}>{name}</h2>
      <p>{bio}</p>
    </div>
  )
}
