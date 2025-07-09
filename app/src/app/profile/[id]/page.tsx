import { UserProfile } from '@/components/UserProfile'
import { initI18n } from '@/i18n'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const i18n = await initI18n('en')
  const { id } = await params
  return (
    <UserProfile
      name={i18n.t('userName', { id })}
      bio={i18n.t('defaultBio')}
    />
  )
}
