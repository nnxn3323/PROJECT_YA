import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { usageLogs } from "@/db/schema";
import { databaseUnavailable, requireApiRole } from "@/lib/api-guard";

export async function GET() {
  const { response } = await requireApiRole("MASTER");
  if (response) return response;
  if (!db) return databaseUnavailable();

  const logs = await db
    .select()
    .from(usageLogs)
    .orderBy(desc(usageLogs.createdAt))
    .limit(100);

  return NextResponse.json({ logs });
}
