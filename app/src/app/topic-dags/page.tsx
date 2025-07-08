import { TopicDAGList } from '@/components/TopicDAGList'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'
import { initI18n } from '@/i18n'

export default async function TopicDAGsPage() {
  const i18n = await initI18n('en')
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>{i18n.t('myCurriculums')}</h1>
        <p>{i18n.t('signInDags')}</p>
      </div>
    )
  }
  return (
    <div style={{ padding: '2rem' }}>
      <h1>{i18n.t('myCurriculums')}</h1>
      <p style={{ marginBottom: '1rem' }}>
        <Link href="/curriculum-generator">{i18n.t('newCurriculum')}</Link>
      </p>
      <TopicDAGList />
    </div>
  )
}
