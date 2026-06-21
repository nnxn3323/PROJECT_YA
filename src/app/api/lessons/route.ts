import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import { lessons, parentStudents, parents, students } from "@/db/schema";
import { databaseUnavailable } from "@/lib/api-guard";

const subjectSchema = z.enum([
  "KOREAN",
  "MATH",
  "ENGLISH",
  "SCIENCE",
  "SOCIAL",
  "KOREAN_HISTORY",
  "ETC"
]);

const lessonSchema = z.object({
  studentId: z.string().min(1).optional(),
  dayOfWeek: z.number().min(1).max(7),
  subject: subjectSchema,
  title: z.string().min(1),
  location: z.string().optional().nullable(),
  mode: z.enum(["ONLINE", "OFFLINE"]).default("ONLINE"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/)
});

const lessonPatchSchema = lessonSchema.partial().extend({
  id: z.string().min(1)
});

async function resolveStudentId(requestedStudentId?: string | null) {
  const session = await auth();
  if (!session?.user || !db) return null;

  if (session.user.role === "ADMIN") return requestedStudentId ?? null;

  if (session.user.role === "STUDENT") {
    const [student] = await db
      .select({ id: students.id })
      .from(students)
      .where(eq(students.userId, session.user.id))
      .limit(1);
    return student?.id ?? null;
  }

  if (session.user.role === "PARENT") {
    if (requestedStudentId) {
      const [requestedChild] = await db
        .select({ id: parentStudents.studentId })
        .from(parents)
        .innerJoin(parentStudents, eq(parentStudents.parentId, parents.id))
        .where(
          and(
            eq(parents.userId, session.user.id),
            eq(parentStudents.studentId, requestedStudentId)
          )
        )
        .limit(1);
      return requestedChild?.id ?? null;
    }

    const [child] = await db
      .select({ id: parentStudents.studentId })
      .from(parents)
      .innerJoin(parentStudents, eq(parentStudents.parentId, parents.id))
      .where(eq(parents.userId, session.user.id))
      .limit(1);
    return requestedStudentId ?? child?.id ?? null;
  }

  return null;
}

export async function GET(request: Request) {
  if (!db) return databaseUnavailable();
  const { searchParams } = new URL(request.url);
  const studentId = await resolveStudentId(searchParams.get("studentId"));
  if (!studentId) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const rows = await db
    .select()
    .from(lessons)
    .where(eq(lessons.studentId, studentId))
    .orderBy(lessons.dayOfWeek, lessons.startTime);

  return NextResponse.json({ lessons: rows });
}

export async function POST(request: Request) {
  if (!db) return databaseUnavailable();
  const payload = lessonSchema.parse(await request.json());
  const studentId = await resolveStudentId(payload.studentId);
  if (!studentId) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const [lesson] = await db
    .insert(lessons)
    .values({ ...payload, studentId })
    .returning();

  return NextResponse.json(lesson, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!db) return databaseUnavailable();
  const { id, studentId: requestedStudentId, ...payload } = lessonPatchSchema.parse(
    await request.json()
  );
  const studentId = await resolveStudentId(requestedStudentId);
  if (!studentId) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const [lesson] = await db
    .update(lessons)
    .set({ ...payload, updatedAt: new Date() })
    .where(and(eq(lessons.id, id), eq(lessons.studentId, studentId)))
    .returning();

  return NextResponse.json({ lesson });
}

export async function DELETE(request: Request) {
  if (!db) return databaseUnavailable();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const studentId = await resolveStudentId(searchParams.get("studentId"));
  if (!id || !studentId) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  await db
    .delete(lessons)
    .where(and(eq(lessons.id, id), eq(lessons.studentId, studentId)));

  return NextResponse.json({ ok: true });
}
