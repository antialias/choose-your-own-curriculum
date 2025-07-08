import { StudentManager } from '@/components/StudentManager'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'
import { initI18n } from '@/i18n'

export default async function StudentsPage() {
  const i18n = await initI18n('en')
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>{i18n.t('students')}</h1>
        <p>{i18n.t('signInManage')}</p>
      </div>
    )
  }
  return (
    <div style={{ padding: '2rem' }}>
      <h1>{i18n.t('students')}</h1>
      <StudentManager />
    </div>
  )
}
