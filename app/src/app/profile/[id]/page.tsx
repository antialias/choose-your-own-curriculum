import { UserProfile } from '@/components/UserProfile'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfilePage({ params }: any) {
  return <UserProfile name={`User ${params.id}`} bio="This is the bio." />
}
