import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import { navItems } from "@/navItems";
import { getDb } from "@/db";
import { teacherStudents, topicDags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { css } from "@/styled-system/css";
import { HomeCard } from "@/components/HomeCard";

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
    <main
      className={css({
        paddingY: "10",
        display: "flex",
        flexDir: "column",
        alignItems: "center",
        gap: "8",
      })}
    >
      <header className={css({ textAlign: "center" })}>
        <h1 className={css({ fontSize: "3xl", fontWeight: "bold" })}>
          Choose Your Own Curriculum
        </h1>
        <p className={css({ mt: "2", color: "gray.600" })}>
          Build plans and track progress
        </p>
      </header>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", md: "repeat(3, 1fr)" },
          gap: "6",
          width: "full",
          maxW: "5xl",
        })}
      >
        {items.map((item) => {
          let label = item.label;
          if (item.key === "students") label = `${studentCount} students`;
          if (item.key === "curriculums") label = `${curriculumCount} curriculums`;
          return (
            <HomeCard
              key={item.href}
              href={item.href}
              label={label}
              description={item.description}
            />
          );
        })}
      </div>
    </main>
  );
}
