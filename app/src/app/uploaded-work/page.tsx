import { UploadedWorkList } from '@/components/UploadedWorkList';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';

export default async function UploadedWorkPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Uploaded Work</h1>
        <p>Please sign in to view your uploads.</p>
      </div>
    );
  }
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Uploaded Work</h1>
      <UploadedWorkList />
    </div>
  );
}
