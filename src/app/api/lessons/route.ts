import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { lessons } from "@/db/schema";

const lessonSchema = z.object({
  studentId: z.string().min(1),
  dayOfWeek: z.number().min(1).max(7),
  subject: z.enum([
    "KOREAN",
    "MATH",
    "ENGLISH",
    "SCIENCE",
    "SOCIAL",
    "KOREAN_HISTORY",
    "ETC"
  ]),
  title: z.string().min(1),
  location: z.string().optional().nullable(),
  mode: z.enum(["ONLINE", "OFFLINE"]).default("ONLINE"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/)
});

export async function POST(request: Request) {
  const payload = lessonSchema.parse(await request.json());

  try {
    if (!db) throw new Error("DATABASE_URL is not configured");

    const [lesson] = await db.insert(lessons).values(payload).returning();
    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "DATABASE_NOT_READY", detail: error instanceof Error ? error.message : "" },
      { status: 503 }
    );
  }
}
