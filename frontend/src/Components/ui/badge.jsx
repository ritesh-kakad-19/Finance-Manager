import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#1677FF]/12 text-[#16D9FF]",
        income: "border-transparent bg-[#00D084]/12 text-[#00D084]",
        expense: "border-transparent bg-[#FF4545]/12 text-[#FF4545]",
        pending: "border-transparent bg-[#FFB020]/12 text-[#FFB020]",
        category: "border-transparent bg-[#6C4DFF]/12 text-[#c4b5ff]",
        outline: "border-white/10 text-[#A7B1C5]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
