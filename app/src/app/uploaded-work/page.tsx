import { db } from '@/db';
import { uploadedWork } from '@/db/schema';
import { UploadForm } from '@/components/UploadForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function UploadedWorkPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    redirect('/login');
  }
  const works = await db
    .select()
    .from(uploadedWork)
    .where(eq(uploadedWork.userId, userId as string));
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Uploaded Work</h1>
      <UploadForm />
      <ul>
        {works.map((w) => (
          <li key={w.id} style={{ marginBottom: '1rem' }}>
            <strong>{new Date(w.dateCompleted || w.dateUploaded).toDateString()}</strong>
            <p>{w.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
