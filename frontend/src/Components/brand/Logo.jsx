import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const Logo = ({ className, iconClassName, showWordmark = true, size = "md" }) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1677FF] to-[#16D9FF] text-white shadow-[0_8px_20px_rgba(22,119,255,0.28)]",
          sizes[size]
        )}
      >
        <Wallet className={cn("h-5 w-5", iconClassName)} />
      </div>
      {showWordmark ? (
        <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Financely</span>
      ) : null}
    </div>
  );
};

export default Logo;
