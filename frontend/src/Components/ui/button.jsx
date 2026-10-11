import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1677FF] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#1677FF] to-[#16D9FF] text-white hover:opacity-90 shadow-md shadow-[#1677FF]/20 border-0 active:scale-[0.98]",
        primary:
          "bg-gradient-to-r from-[#1677FF] to-[#16D9FF] text-white hover:opacity-90 shadow-md shadow-[#1677FF]/20 border-0 active:scale-[0.98]",
        secondary:
          "bg-[#101827] text-white border border-white/10 hover:border-white/20 hover:bg-[#101A2D] active:scale-[0.98]",
        outline:
          "bg-[#101827] text-white border border-white/10 hover:border-white/20 hover:bg-[#101A2D] active:scale-[0.98]",
        danger:
          "bg-[#101827] text-[#FF4545] border border-[#FF4545]/30 hover:border-[#FF4545]/60 hover:bg-[#FF4545]/10 active:scale-[0.98]",
        destructive:
          "bg-[#101827] text-[#FF4545] border border-[#FF4545]/30 hover:border-[#FF4545]/60 hover:bg-[#FF4545]/10 active:scale-[0.98]",
        ghost:
          "bg-transparent text-[#A7B1C5] hover:bg-[#101A2D] hover:text-white",
        link:
          "text-[#1677FF] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 rounded-[10px] px-3 text-xs",
        lg: "h-12 rounded-[12px] px-6 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
