import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { roleHome } from "@/lib/access";

export default async function PublicPage() {
  const session = await auth();
  redirect(session?.user?.role ? roleHome[session.user.role] : "/login");
}
