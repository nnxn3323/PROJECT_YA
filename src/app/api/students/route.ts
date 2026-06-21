import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { students, users } from "@/db/schema";
import { databaseUnavailable, requireApiRole } from "@/lib/api-guard";

export async function GET() {
  const { response } = await requireApiRole("ADMIN");
  if (response) return response;
  if (!db) return databaseUnavailable();

  const rows = await db
    .select({
      id: students.id,
      name: users.name,
      email: users.email,
      school: students.school,
      grade: students.grade,
      defaultTuition: students.defaultTuition,
      nextPaymentDue: students.nextPaymentDue
    })
    .from(students)
    .innerJoin(users, eq(students.userId, users.id));

  return NextResponse.json({ students: rows });
}
