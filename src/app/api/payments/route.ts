import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { parentStudents, parents, payments } from "@/db/schema";
import { databaseUnavailable, requireApiRole } from "@/lib/api-guard";

export async function GET() {
  const { session, response } = await requireApiRole("PARENT");
  if (response) return response;
  if (!db) return databaseUnavailable();

  const rows = await db
    .select({
      id: payments.id,
      studentId: payments.studentId,
      amount: payments.amount,
      dueDate: payments.dueDate,
      paidAt: payments.paidAt,
      status: payments.status
    })
    .from(parents)
    .innerJoin(parentStudents, eq(parentStudents.parentId, parents.id))
    .innerJoin(payments, eq(payments.studentId, parentStudents.studentId))
    .where(eq(parents.userId, session!.user.id));

  return NextResponse.json({ payments: rows });
}
