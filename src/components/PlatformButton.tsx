import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PlatformButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  icon: ReactNode;
};

export function PlatformButton({ active, icon, children, className, ...props }: PlatformButtonProps) {
  return (
    <button
      type="button"
      className={cn("platform-nav-button", active && "platform-nav-button-active", className)}
      {...props}
    >
      <span className="platform-nav-icon" aria-hidden="true">{icon}</span>
      <span>{children}</span>
    </button>
  );
}
