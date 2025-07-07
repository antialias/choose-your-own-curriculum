import { db } from '@/db';
import { uploadedWork } from '@/db/schema';
import { UploadForm } from '@/components/UploadForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function UploadedWorkPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  const works = await db.select().from(uploadedWork);
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
