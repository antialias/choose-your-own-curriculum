import { css } from "@/styled-system/css";
import { NavCard } from "@/components/NavCard";
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
    <div
      className={css({
        maxW: "xl",
        mx: "auto",
        py: "8",
        px: "4",
        textAlign: "center",
      })}
    >
      <h1 className={css({ fontSize: "3xl", fontWeight: "bold", mb: "6" })}>
        Choose Your Own Curriculum
      </h1>
      <div className={css({ display: "grid", gap: "4", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" })}>
        {items.map((item) => {
          let count: number | undefined;
          if (item.key === "students") count = studentCount;
          if (item.key === "curriculums") count = curriculumCount;
          return (
            <NavCard key={item.href} href={item.href} label={item.label} count={count} />
          );
        })}
      </div>
    </div>
  );
}
