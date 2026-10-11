import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = createContext({
  toast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[80] flex w-[min(100%-2rem,360px)] flex-col gap-2">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur-xl",
              item.type === "error"
                ? "border-[#FF4545]/25 bg-[#0a1426]/90 text-[#FF4545]"
                : "border-[#00D084]/25 bg-[#0a1426]/90 text-[#00D084]"
            )}
          >
            {item.type === "error" ? (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <p className="flex-1 text-sm font-medium text-white">{item.message}</p>
            <button
              type="button"
              className="text-[#6F7B91] hover:text-white"
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== item.id))}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
