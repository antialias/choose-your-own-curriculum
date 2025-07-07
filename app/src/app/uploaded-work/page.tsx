import { db } from '@/db';
import { workUploads, students } from '@/db/schema';
import { UploadedWorkList } from '@/components/UploadedWorkList';
import { eq } from 'drizzle-orm';

export default async function UploadedWorkPage() {
  const rows = await db
    .select({
      id: workUploads.id,
      summary: workUploads.summary,
      completedAt: workUploads.completedAt,
      studentName: students.name,
    })
    .from(workUploads)
    .leftJoin(students, eq(workUploads.studentId, students.id));

  const items = rows.map((r) => ({
    id: r.id,
    summary: r.summary ?? '',
    studentName: r.studentName ?? 'Unknown',
    completedAt: r.completedAt ? new Date(r.completedAt) : null,
  }));

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Uploaded Work</h1>
      <UploadedWorkList items={items} />
    </div>
  );
}
