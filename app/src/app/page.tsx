import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import { navItems } from '@/navItems';
import { getDb } from '@/db';
import { teacherStudents, topicDags } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  let studentCount = 0;
  let curriculumCount = 0;

  if (userId) {
    const db = getDb();
    studentCount = (
      await db
        .select({ id: teacherStudents.studentId })
        .from(teacherStudents)
        .where(eq(teacherStudents.teacherId, userId))
    ).length;
    curriculumCount = (
      await db
        .select({ id: topicDags.id })
        .from(topicDags)
        .where(eq(topicDags.userId, userId))
    ).length;
  }

  const items = navItems;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Choose Your Own Curriculum</h1>
      <ul>
        {items.map((item) => {
          let text = item.label;
          if (item.key === 'students') text = `${studentCount} students`;
          if (item.key === 'curriculums') text = `${curriculumCount} curriculums`;
          return (
            <li key={item.href} style={{ marginBottom: '0.5rem' }}>
              <Link href={item.href}>{text}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
