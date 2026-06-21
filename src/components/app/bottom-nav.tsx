"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { CalendarDays, LogOut, Shield, UserRound, Wrench } from "lucide-react";
import type { UserRole } from "@/db/schema";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { cn } from "@/lib/utils";

const roleItems = {
  STUDENT: { href: "/student", label: "학생", icon: CalendarDays },
  PARENT: { href: "/parent", label: "학부모", icon: UserRound },
  ADMIN: { href: "/admin", label: "관리", icon: Shield },
  MASTER: { href: "/master", label: "마스터", icon: Wrench }
} satisfies Record<
  UserRole,
  {
    href: string;
    label: string;
    icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  }
>;

export function BottomNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const LogoutIcon = LogOut;

  if (status === "loading" || !role) return null;

  const item = roleItems[role];
  const Icon = item.icon;
  const active = pathname.startsWith(item.href);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full border-t border-border bg-card/85 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-glass backdrop-blur-2xl md:left-1/2 md:max-w-md md:-translate-x-1/2 md:rounded-t-lg md:border">
      <div className="grid grid-cols-3 gap-1">
        <Link
          href={item.href}
          className={cn(
            "flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold text-muted-foreground transition-colors",
            active && "bg-primary text-primary-foreground"
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
          <span>{item.label}</span>
        </Link>
        <ThemeToggle />
        <button
          onClick={() => void signOut({ callbackUrl: "/login" })}
          className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-muted"
        >
          <LogoutIcon className="h-5 w-5" aria-hidden />
          <span>로그아웃</span>
        </button>
      </div>
    </nav>
  );
}
