"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/app/theme-toggle";

export function AccountBar() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="fixed right-3 top-3 z-40 flex items-center gap-2">
      <div className="hidden rounded-md border border-border bg-card/85 px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur-xl sm:block">
        {session.user.email}
      </div>
      <ThemeToggle compact />
      <Button
        type="button"
        size="icon"
        variant="glass"
        onClick={() => void signOut({ callbackUrl: "/login" })}
        aria-label="로그아웃"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
