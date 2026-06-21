"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  BarChart3,
  CalendarDays,
  Home,
  LogOut,
  Shield,
  UserRound,
  Wrench
} from "lucide-react";
import type { UserRole } from "@/db/schema";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "홈", icon: Home, roles: ["STUDENT", "PARENT", "ADMIN", "MASTER"] },
  { href: "/student", label: "학생", icon: CalendarDays, roles: ["STUDENT"] },
  { href: "/parent", label: "학부모", icon: UserRound, roles: ["PARENT"] },
  { href: "/admin", label: "관리", icon: Shield, roles: ["ADMIN"] },
  { href: "/master", label: "마스터", icon: Wrench, roles: ["MASTER"] },
  { href: "/public", label: "게시", icon: BarChart3, roles: ["STUDENT", "PARENT", "ADMIN", "MASTER"] }
] satisfies Array<{
  href: string;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  roles: UserRole[];
}>;

const gridColumns: Record<number, string> = {
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5"
};

function visibleItems(role?: UserRole) {
  if (!role) return [];
  return items.filter((item) => item.roles.includes(role));
}

export function BottomNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const navItems = visibleItems(role);
  const columns = gridColumns[Math.min(navItems.length + 1, 5)] ?? "grid-cols-5";
  const LogoutIcon = LogOut;

  if (status === "loading" || !role) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full border-t border-white/45 bg-white/55 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-glass backdrop-blur-2xl md:left-1/2 md:max-w-3xl md:-translate-x-1/2 md:rounded-t-lg md:border">
      <div className={cn("grid gap-1", columns)}>
        {navItems.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold text-muted-foreground transition-colors",
                active && "bg-primary text-primary-foreground"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => void signOut({ callbackUrl: "/login" })}
          className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-white/50"
        >
          <LogoutIcon className="h-5 w-5" aria-hidden />
          <span>로그아웃</span>
        </button>
      </div>
    </nav>
  );
}
