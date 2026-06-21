import type { AdminLevel, UserRole } from "@/db/schema";

export type AppSession = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  adminLevel?: AdminLevel;
};

export function getDemoSession(role: UserRole = "STUDENT"): AppSession {
  if (role === "MASTER") {
    return { id: "master-demo", name: "웹마스터", email: "master@example.com", role };
  }

  if (role === "ADMIN") {
    return {
      id: "admin-demo",
      name: "관리자",
      email: "admin@example.com",
      role,
      adminLevel: "DIRECTOR"
    };
  }

  if (role === "PARENT") {
    return { id: "parent-demo", name: "김보호", email: "parent@example.com", role };
  }

  return { id: "student-demo", name: "김하늘", email: "student@example.com", role };
}

export function canUseAdminLevel(
  session: AppSession,
  minimum: 1 | 2 | 3 | 4
) {
  const levels: Record<AdminLevel, number> = {
    ASSISTANT: 1,
    STAFF: 2,
    DEPUTY: 3,
    DIRECTOR: 4
  };

  if (session.role !== "ADMIN" || !session.adminLevel) return false;
  return levels[session.adminLevel] >= minimum;
}
