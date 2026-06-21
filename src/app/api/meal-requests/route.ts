import { NextResponse } from "next/server";
import { and, eq, gte, lte } from "drizzle-orm";
import { addMonths, startOfDay } from "date-fns";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import { mealRequests, parentStudents, parents } from "@/db/schema";
import { databaseUnavailable, requireApiRole } from "@/lib/api-guard";

const mealSchema = z.object({
  studentId: z.string().min(1),
  date: z.string().date(),
  requested: z.boolean().default(true)
});

async function parentOwnsStudent(studentId: string) {
  const session = await auth();
  if (!session?.user || !db) return false;

  if (session.user.role === "ADMIN") return true;
  if (session.user.role !== "PARENT") return false;

  const [link] = await db
    .select({ studentId: parentStudents.studentId })
    .from(parents)
    .innerJoin(parentStudents, eq(parentStudents.parentId, parents.id))
    .where(and(eq(parents.userId, session.user.id), eq(parentStudents.studentId, studentId)))
    .limit(1);

  return Boolean(link);
}

export async function GET(request: Request) {
  const { response } = await requireApiRole("PARENT");
  if (response) return response;
  if (!db) return databaseUnavailable();

  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");
  if (!studentId || !(await parentOwnsStudent(studentId))) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const start = startOfDay(new Date());
  const end = addMonths(start, 1);
  const rows = await db
    .select()
    .from(mealRequests)
    .where(
      and(
        eq(mealRequests.studentId, studentId),
        gte(mealRequests.date, start),
        lte(mealRequests.date, end)
      )
    );

  return NextResponse.json({ mealRequests: rows });
}

export async function POST(request: Request) {
  if (!db) return databaseUnavailable();
  const payload = mealSchema.parse(await request.json());
  if (!(await parentOwnsStudent(payload.studentId))) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const date = startOfDay(new Date(payload.date));
  const existing = await db
    .select()
    .from(mealRequests)
    .where(and(eq(mealRequests.studentId, payload.studentId), eq(mealRequests.date, date)))
    .limit(1);

  const [meal] = existing.length
    ? await db
        .update(mealRequests)
        .set({ requested: payload.requested, updatedAt: new Date() })
        .where(eq(mealRequests.id, existing[0].id))
        .returning()
    : await db
        .insert(mealRequests)
        .values({ studentId: payload.studentId, date, requested: payload.requested })
        .returning();

  return NextResponse.json(meal);
}
