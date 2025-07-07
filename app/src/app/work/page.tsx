import { db } from '@/db';
import { workUploads } from '@/db/schema';
import { authOptions } from '@/auth/options';
import { getServerSession } from 'next-auth';
import { UploadWorkForm } from '@/components/UploadWorkForm';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

export default async function WorkPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!session || !userId) {
    return <p>Please sign in to view uploads.</p>;
  }
  const uploads = await db
    .select()
    .from(workUploads)
    .where(eq(workUploads.userId, userId));
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Uploaded Work</h1>
      <UploadWorkForm />
      <ul>
        {uploads.map((u) => (
          <li key={u.id}>
            <Link href={`/uploads/${u.file}`}>{u.originalName}</Link> - {u.summary}
          </li>
        ))}
      </ul>
    </div>
  );
}
