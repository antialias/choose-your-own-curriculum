import { db } from '@/db';
import { uploadedWork } from '@/db/schema';
import { UploadForm } from '@/components/UploadForm';
import { SummaryWithMath } from '@/components/SummaryWithMath';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import { eq } from 'drizzle-orm';

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
  const works = await db
    .select()
    .from(uploadedWork)
    .where(eq(uploadedWork.userId, userId));
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Uploaded Work</h1>
      <UploadForm />
      <ul>
        {works.map((w) => (
          <li key={w.id} style={{ marginBottom: '1rem' }}>
            <strong>{new Date(w.dateCompleted || w.dateUploaded).toDateString()}</strong>
            <SummaryWithMath text={w.summary ?? ''} />
          </li>
        ))}
      </ul>
    </div>
  );
}
