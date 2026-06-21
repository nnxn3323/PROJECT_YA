import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { payments } from "@/db/schema";
import { databaseUnavailable, requireAdminApiLevel } from "@/lib/api-guard";

const paymentRequestSchema = z.object({
  paymentId: z.string().min(1)
});

export async function POST(request: Request) {
  const { response } = await requireAdminApiLevel(2);
  if (response) return response;
  if (!db) return databaseUnavailable();

  const payload = paymentRequestSchema.parse(await request.json());
  const [payment] = await db
    .update(payments)
    .set({ status: "REQUESTED", updatedAt: new Date() })
    .where(eq(payments.id, payload.paymentId))
    .returning();

  return NextResponse.json(payment);
}
