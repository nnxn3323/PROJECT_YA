import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm border border-white/50 bg-white/55 px-2 py-0.5 text-xs font-semibold text-foreground backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}
