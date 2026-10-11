import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction, className }) => (
  <div className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}>
    {Icon ? (
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#16D9FF]">
        <Icon className="h-6 w-6" />
      </div>
    ) : null}
    <h3 className="text-base font-semibold text-white">{title}</h3>
    {description ? <p className="mt-1 max-w-sm text-sm text-[#A7B1C5]">{description}</p> : null}
    {actionLabel && onAction ? (
      <Button variant="primary" className="mt-5" onClick={onAction}>
        {actionLabel}
      </Button>
    ) : null}
  </div>
);

export { EmptyState };
