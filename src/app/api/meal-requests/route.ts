import { NextResponse } from "next/server";
import { startOfDay } from "date-fns";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { mealRequests } from "@/db/schema";

const mealSchema = z.object({
  studentId: z.string().min(1),
  date: z.string().date(),
  requested: z.boolean().default(true)
});

export async function POST(request: Request) {
  const payload = mealSchema.parse(await request.json());
  const date = startOfDay(new Date(payload.date));

  try {
    if (!db) throw new Error("DATABASE_URL is not configured");

    const existing = await db
      .select()
      .from(mealRequests)
      .where(
        and(eq(mealRequests.studentId, payload.studentId), eq(mealRequests.date, date))
      )
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
  } catch (error) {
    return NextResponse.json(
      { error: "DATABASE_NOT_READY", detail: error instanceof Error ? error.message : "" },
      { status: 503 }
    );
  }
}
