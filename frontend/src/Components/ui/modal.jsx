import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Modal = ({ open, onClose, title, description, children, className }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-[#0A1426] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
          className
        )}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title ? <h2 className="text-xl font-semibold text-white">{title}</h2> : null}
            {description ? <p className="mt-1 text-sm text-[#A7B1C5]">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-btn h-9 w-9"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export { Modal };
