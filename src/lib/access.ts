import type { AdminLevel, UserRole } from "@/db/schema";
import { adminLevelRanks } from "@/lib/constants";

export const roleHome: Record<UserRole, string> = {
  STUDENT: "/student",
  PARENT: "/parent",
  ADMIN: "/admin",
  MASTER: "/master"
};

export function canAccessPath(
  pathname: string,
  role?: UserRole,
  adminLevel?: AdminLevel | null
) {
  if (
    pathname === "/login" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return true;
  }

  if (!role) return false;
  if (pathname === "/" || pathname.startsWith("/public")) return true;
  if (pathname.startsWith("/student")) return role === "STUDENT";
  if (pathname.startsWith("/parent")) return role === "PARENT";
  if (pathname.startsWith("/master")) return role === "MASTER";
  if (pathname.startsWith("/admin/scores")) {
    return role === "ADMIN" && !!adminLevel && adminLevelRanks[adminLevel] >= 2;
  }
  if (pathname.startsWith("/admin")) return role === "ADMIN";

  return true;
}
