import { UserProfile } from '@/components/UserProfile'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <UserProfile name={`User ${id}`} bio="This is the bio." />
}
