import { NextResponse } from "next/server";
import { and, eq, gte, lte } from "drizzle-orm";
import { startOfDay } from "date-fns";
import { db } from "@/db";
import { mealRequests, students, users } from "@/db/schema";
import { databaseUnavailable, requireAdminApiLevel } from "@/lib/api-guard";

export async function GET(request: Request) {
  const { response } = await requireAdminApiLevel(2);
  if (response) return response;
  if (!db) return databaseUnavailable();

  const { searchParams } = new URL(request.url);
  const dateValue = searchParams.get("date");
  const start = startOfDay(dateValue ? new Date(dateValue) : new Date());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const rows = await db
    .select({
      id: mealRequests.id,
      date: mealRequests.date,
      requested: mealRequests.requested,
      studentId: students.id,
      studentName: users.name
    })
    .from(mealRequests)
    .innerJoin(students, eq(students.id, mealRequests.studentId))
    .innerJoin(users, eq(users.id, students.userId))
    .where(and(gte(mealRequests.date, start), lte(mealRequests.date, end)));

  return NextResponse.json({ mealRequests: rows, count: rows.length });
}
