import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { students, users } from "@/db/schema";
import { databaseUnavailable, requireApiRole } from "@/lib/api-guard";

export async function GET() {
  const { session, response } = await requireApiRole("STUDENT");
  if (response) return response;
  if (!db) return databaseUnavailable();

  const [student] = await db
    .select({
      id: students.id,
      name: users.name,
      email: users.email,
      school: students.school,
      grade: students.grade,
      memo: students.memo,
      defaultTuition: students.defaultTuition,
      nextPaymentDue: students.nextPaymentDue
    })
    .from(students)
    .innerJoin(users, eq(students.userId, users.id))
    .where(eq(users.id, session!.user.id))
    .limit(1);

  return NextResponse.json({ student });
}
