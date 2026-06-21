import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export const dynamic = "force-dynamic";

function databaseHost() {
  const value = process.env.DATABASE_URL;
  if (!value) return null;

  try {
    return new URL(value).host;
  } catch {
    return "invalid-url";
  }
}

export async function GET() {
  const configured = Boolean(process.env.DATABASE_URL);

  if (!db) {
    return NextResponse.json(
      {
        ok: false,
        configured,
        host: databaseHost(),
        error: "DATABASE_URL is not configured in this runtime"
      },
      { status: 503 }
    );
  }

  try {
    const [result] = await db
      .select({
        userCount: sql<number>`count(*)::int`,
        passwordUserCount: sql<number>`count(${users.passwordHash})::int`
      })
      .from(users);

    return NextResponse.json({
      ok: true,
      configured,
      host: databaseHost(),
      userCount: Number(result.userCount),
      passwordUserCount: Number(result.passwordUserCount)
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        configured,
        host: databaseHost(),
        error: error instanceof Error ? error.message : "Unknown database error"
      },
      { status: 500 }
    );
  }
}
