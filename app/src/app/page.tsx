import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import { getSqlite } from '@/db';
import { navItems } from '@/navItems';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Overview</h1>
        <p>Please sign in to view your data.</p>
      </div>
    );
  }
  const sqlite = getSqlite();
  const studentRow = sqlite
    .prepare('SELECT COUNT(*) as count FROM teacher_student WHERE teacherId = ?')
    .get(userId) as { count: number };
  const dagRow = sqlite
    .prepare('SELECT COUNT(*) as count FROM topic_dag WHERE userId = ?')
    .get(userId) as { count: number };
  const counts = { students: studentRow.count, curriculums: dagRow.count };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Overview</h1>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems
          .filter((n) => n.href !== '/')
          .map((n) => {
            const countLabel = n.countKey ? `${counts[n.countKey]} ` : '';
            return (
              <li key={n.href}>
                <Link href={n.href}>{countLabel + n.label}</Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
