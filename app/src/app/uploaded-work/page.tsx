import { UploadedWorkList } from '@/components/UploadedWorkList';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import { initI18n } from '@/i18n';

export default async function UploadedWorkPage() {
  const i18n = await initI18n('en');
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>{i18n.t('uploadedWork')}</h1>
        <p>{i18n.t('signInUploads')}</p>
      </div>
    );
  }
  return (
    <div style={{ padding: '2rem' }}>
      <h1>{i18n.t('uploadedWork')}</h1>
      <UploadedWorkList />
    </div>
  );
}
