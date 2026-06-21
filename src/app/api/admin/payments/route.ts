import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { payments, students, users } from "@/db/schema";
import { databaseUnavailable, requireAdminApiLevel } from "@/lib/api-guard";

const paymentPatchSchema = z.object({
  id: z.string().min(1),
  amount: z.number().int().positive().optional(),
  dueDate: z.string().date().optional(),
  status: z.enum(["PENDING", "REQUESTED", "PAID", "OVERDUE"]).optional()
});

export async function GET() {
  const { response } = await requireAdminApiLevel(2);
  if (response) return response;
  if (!db) return databaseUnavailable();

  const rows = await db
    .select({
      id: payments.id,
      amount: payments.amount,
      dueDate: payments.dueDate,
      paidAt: payments.paidAt,
      status: payments.status,
      studentId: students.id,
      studentName: users.name
    })
    .from(payments)
    .innerJoin(students, eq(students.id, payments.studentId))
    .innerJoin(users, eq(users.id, students.userId));

  return NextResponse.json({ payments: rows });
}

export async function PATCH(request: Request) {
  const { response } = await requireAdminApiLevel(3);
  if (response) return response;
  if (!db) return databaseUnavailable();

  const { id, dueDate, ...payload } = paymentPatchSchema.parse(await request.json());
  const [payment] = await db
    .update(payments)
    .set({
      ...payload,
      ...(dueDate ? { dueDate: new Date(dueDate) } : {}),
      updatedAt: new Date()
    })
    .where(eq(payments.id, id))
    .returning();

  return NextResponse.json({ payment });
}
