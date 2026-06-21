import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { studySessions } from "@/db/schema";

const studySchema = z.object({
  studentId: z.string().min(1),
  subject: z.enum([
    "KOREAN",
    "MATH",
    "ENGLISH",
    "SCIENCE",
    "SOCIAL",
    "KOREAN_HISTORY",
    "ETC"
  ]),
  content: z.string().min(1),
  seatLabel: z.string().optional().nullable()
});

export async function POST(request: Request) {
  const payload = studySchema.parse(await request.json());

  try {
    if (!db) throw new Error("DATABASE_URL is not configured");

    await db
      .update(studySessions)
      .set({ isActive: false, endedAt: new Date() })
      .where(
        and(
          eq(studySessions.studentId, payload.studentId),
          eq(studySessions.isActive, true)
        )
      );

    const [session] = await db.insert(studySessions).values(payload).returning();
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "DATABASE_NOT_READY", detail: error instanceof Error ? error.message : "" },
      { status: 503 }
    );
  }
}
