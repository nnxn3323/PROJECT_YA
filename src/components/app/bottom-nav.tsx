"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, Home, Shield, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "홈", icon: Home },
  { href: "/student", label: "학생", icon: CalendarDays },
  { href: "/parent", label: "학부모", icon: UserRound },
  { href: "/admin", label: "관리", icon: Shield },
  { href: "/public", label: "게시", icon: BarChart3 }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full border-t border-white/45 bg-white/55 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-glass backdrop-blur-2xl md:left-1/2 md:max-w-3xl md:-translate-x-1/2 md:rounded-t-lg md:border">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
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
      </div>
    </nav>
  );
}
