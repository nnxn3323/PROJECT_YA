import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { UserRole } from "@/db/schema";
import { roleHome } from "@/lib/access";

export async function requireRole(role: UserRole) {
  const session = await auth();
  const currentRole = session?.user?.role;

  if (!currentRole) {
    redirect("/login");
  }

  if (currentRole !== role) {
    redirect(roleHome[currentRole]);
  }

  return session;
}
