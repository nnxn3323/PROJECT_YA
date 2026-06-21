import { addDays, addMonths, endOfMonth, startOfDay } from "date-fns";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import {
  lessons,
  mealRequests as mealRequestsTable,
  payments as paymentsTable,
  students,
  studySessions,
  users
} from "@/db/schema";
import { demoLessons, demoStudent, demoStudents } from "@/lib/demo-data";
import type { LessonView } from "@/types/schedule";

export async function getStudentWorkspace() {
  try {
    if (!db) throw new Error("DATABASE_URL is not configured");
    const database = db;

    const rows = await database
      .select({
        id: students.id,
        school: students.school,
        grade: students.grade,
        defaultTuition: students.defaultTuition,
        nextPaymentDue: students.nextPaymentDue,
        name: users.name
      })
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .limit(1);

    const student = rows[0];
    if (!student) {
      return { student: demoStudent, lessons: demoLessons };
    }

    const studentLessons = await database
      .select()
      .from(lessons)
      .where(eq(lessons.studentId, student.id))
      .orderBy(lessons.dayOfWeek, lessons.startTime);

    return {
      student: {
        id: student.id,
        name: student.name,
        school: student.school,
        grade: student.grade,
        defaultTuition: student.defaultTuition,
        nextPaymentDue: student.nextPaymentDue
      },
      lessons: studentLessons as LessonView[]
    };
  } catch {
    return { student: demoStudent, lessons: demoLessons };
  }
}

export async function getParentWorkspace() {
  const workspace = await getStudentWorkspace();
  const tomorrow = addDays(startOfDay(new Date()), 1);
  const until = addMonths(tomorrow, 1);

  try {
    if (!db) throw new Error("DATABASE_URL is not configured");
    const database = db;

    const [mealRequests, payments] = await Promise.all([
      database
        .select()
        .from(mealRequestsTable)
        .where(
          and(
            eq(mealRequestsTable.studentId, workspace.student.id),
            gte(mealRequestsTable.date, tomorrow),
            lte(mealRequestsTable.date, until)
          )
        ),
      database
        .select()
        .from(paymentsTable)
        .where(eq(paymentsTable.studentId, workspace.student.id))
        .orderBy(paymentsTable.dueDate)
    ]);

    return { ...workspace, mealRequests, payments, tomorrow, until };
  } catch {
    return {
      ...workspace,
      mealRequests: [],
      payments: [
        {
          id: "demo-payment",
          studentId: workspace.student.id,
          amount: 720000,
          dueDate: workspace.student.nextPaymentDue ?? endOfMonth(new Date()),
          paidAt: null,
          status: "PENDING" as const,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      tomorrow,
      until
    };
  }
}

export async function getAdminWorkspace() {
  try {
    if (!db) throw new Error("DATABASE_URL is not configured");
    const database = db;

    const studentRows = await database
      .select({
        id: students.id,
        school: students.school,
        grade: students.grade,
        defaultTuition: students.defaultTuition,
        nextPaymentDue: students.nextPaymentDue,
        name: users.name
      })
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .orderBy(desc(students.createdAt));

    if (!studentRows.length) return demoStudents;

    return Promise.all(
      studentRows.map(async (student) => {
        const [studentLessons, activeStudyRows] = await Promise.all([
          database.select().from(lessons).where(eq(lessons.studentId, student.id)),
          database
            .select()
            .from(studySessions)
            .where(
              and(
                eq(studySessions.studentId, student.id),
                eq(studySessions.isActive, true)
              )
            )
            .limit(1)
        ]);

        return {
          id: student.id,
          name: student.name,
          school: student.school,
          grade: student.grade,
          defaultTuition: student.defaultTuition,
          nextPaymentDue: student.nextPaymentDue,
          activeStudy: activeStudyRows[0] ?? null,
          lessons: studentLessons as LessonView[]
        };
      })
    );
  } catch {
    return demoStudents;
  }
}
