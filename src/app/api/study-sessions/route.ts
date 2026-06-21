import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { studySessions } from "@/db/schema";
import { databaseUnavailable, requireApiRole } from "@/lib/api-guard";

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

export async function GET(request: Request) {
  const { response } = await requireApiRole("ADMIN");
  if (response) return response;
  if (!db) return databaseUnavailable();

  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");
  const where = studentId
    ? and(eq(studySessions.studentId, studentId), eq(studySessions.isActive, true))
    : eq(studySessions.isActive, true);

  const rows = await db.select().from(studySessions).where(where);
  return NextResponse.json({ studySessions: rows });
}

export async function POST(request: Request) {
  const { session, response } = await requireApiRole("ADMIN");
  if (response) return response;
  if (!db) return databaseUnavailable();

  const payload = studySchema.parse(await request.json());

  await db
    .update(studySessions)
    .set({ isActive: false, endedAt: new Date(), updatedAt: new Date() })
    .where(
      and(eq(studySessions.studentId, payload.studentId), eq(studySessions.isActive, true))
    );

  const [studySession] = await db
    .insert(studySessions)
    .values({ ...payload, adminUserId: session!.user.id })
    .returning();

  return NextResponse.json(studySession, { status: 201 });
}
