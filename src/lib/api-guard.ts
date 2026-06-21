import { NextResponse } from "next/server";
import { auth } from "@/auth";
import type { UserRole } from "@/db/schema";
import { adminLevelRanks } from "@/lib/constants";

export async function requireApiRole(role: UserRole) {
  const session = await auth();

  if (!session?.user) {
    return {
      session: null,
      response: NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
    };
  }

  if (session.user.role !== role) {
    return {
      session: null,
      response: NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
    };
  }

  return { session, response: null };
}

export async function requireAnyApiRole(roles: UserRole[]) {
  const session = await auth();

  if (!session?.user) {
    return {
      session: null,
      response: NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
    };
  }

  if (!roles.includes(session.user.role)) {
    return {
      session: null,
      response: NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
    };
  }

  return { session, response: null };
}

export async function requireAdminApiLevel(minimum: 1 | 2 | 3 | 4) {
  const session = await auth();

  if (!session?.user) {
    return {
      session: null,
      response: NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
    };
  }

  if (
    session.user.role !== "ADMIN" ||
    !session.user.adminLevel ||
    adminLevelRanks[session.user.adminLevel] < minimum
  ) {
    return {
      session: null,
      response: NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
    };
  }

  return { session, response: null };
}

export function databaseUnavailable() {
  return NextResponse.json({ error: "DATABASE_NOT_READY" }, { status: 503 });
}
