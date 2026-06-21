import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { payments } from "@/db/schema";

const paymentRequestSchema = z.object({
  paymentId: z.string().min(1)
});

export async function POST(request: Request) {
  const payload = paymentRequestSchema.parse(await request.json());

  try {
    if (!db) throw new Error("DATABASE_URL is not configured");

    const [payment] = await db
      .update(payments)
      .set({ status: "REQUESTED", updatedAt: new Date() })
      .where(eq(payments.id, payload.paymentId))
      .returning();

    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json(
      { error: "DATABASE_NOT_READY", detail: error instanceof Error ? error.message : "" },
      { status: 503 }
    );
  }
}
