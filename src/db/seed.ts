import { db } from ".";
import {
  lessons,
  parentStudents,
  parents,
  payments,
  students,
  users
} from "./schema";

async function main() {
  if (!db) {
    throw new Error("DATABASE_URL is required to seed the database");
  }

  const [studentUser] = await db
    .insert(users)
    .values({
      email: "student@example.com",
      name: "김하늘",
      role: "STUDENT"
    })
    .onConflictDoUpdate({
      target: users.email,
      set: { name: "김하늘", role: "STUDENT" }
    })
    .returning();

  const [student] = await db
    .insert(students)
    .values({
      userId: studentUser.id,
      school: "샘플고",
      grade: "2",
      nextPaymentDue: new Date("2026-07-10")
    })
    .onConflictDoUpdate({
      target: students.userId,
      set: { school: "샘플고", grade: "2" }
    })
    .returning();

  const [parentUser] = await db
    .insert(users)
    .values({
      email: "parent@example.com",
      name: "김보호",
      role: "PARENT"
    })
    .onConflictDoUpdate({
      target: users.email,
      set: { name: "김보호", role: "PARENT" }
    })
    .returning();

  const [parent] = await db
    .insert(parents)
    .values({ userId: parentUser.id })
    .onConflictDoUpdate({
      target: parents.userId,
      set: { updatedAt: new Date() }
    })
    .returning();

  await db
    .insert(parentStudents)
    .values({ parentId: parent.id, studentId: student.id })
    .onConflictDoNothing();

  await db
    .insert(lessons)
    .values([
      {
        studentId: student.id,
        dayOfWeek: 1,
        subject: "MATH",
        title: "수학 심화",
        location: "A룸",
        startTime: "18:00",
        endTime: "20:00"
      },
      {
        studentId: student.id,
        dayOfWeek: 3,
        subject: "ENGLISH",
        title: "영어 독해",
        location: "온라인",
        startTime: "20:00",
        endTime: "22:00"
      }
    ])
    .onConflictDoNothing();

  await db
    .insert(payments)
    .values({
      studentId: student.id,
      amount: 720000,
      dueDate: new Date("2026-07-10"),
      status: "PENDING"
    })
    .onConflictDoNothing();

  await db
    .insert(users)
    .values([
      {
        email: "admin@example.com",
        name: "관리자",
        role: "ADMIN",
        adminLevel: "DIRECTOR"
      },
      {
        email: "master@example.com",
        name: "웹마스터",
        role: "MASTER"
      }
    ])
    .onConflictDoNothing();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
