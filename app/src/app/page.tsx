import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';
import { navItems } from '@/navItems';
import { getDb } from '@/db';
import { teacherStudents, topicDags } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { HomeCard } from '@/components/HomeCard';
import { css } from '@/styled-system/css';
import { pluralize } from '@/lib/pluralize';
import i18n from '@/i18n';

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

  return (
    <div className={css({ px: '8', py: '12', textAlign: 'center' })}>
      <h1 className={css({ fontSize: '4xl', fontWeight: 'bold', mb: '4' })}>
        {i18n.t('home.title')}
      </h1>
      <p className={css({ mb: '8', color: 'gray.600' })}>
        {i18n.t('home.description')}
      </p>
      <div
        className={css({
          display: 'grid',
          gap: '4',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          maxW: '3xl',
          mx: 'auto',
        })}
      >
        {navItems.map((item) => {
          let text = i18n.t(`nav.${item.key}`);
          if (item.key === 'students') {
            text = pluralize(studentCount, 'student');
          }
          if (item.key === 'curriculums') {
            text = pluralize(curriculumCount, 'curriculum', 'curriculums');
          }
          return <HomeCard key={item.href} href={item.href} label={text} />;
        })}
      </div>
    </div>
  );
}
