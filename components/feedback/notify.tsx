"use client";

import { toast } from "sonner";

const DURATION = 3500;

type Tone = "success" | "error" | "info";

// Toast meluncur dari bawah dengan garis waktu (PRD #64)
export function notify(message: string, tone: Tone = "success", action?: { label: string; onClick: () => void }) {
  toast.custom(
    (id) => (
      <div
        role={tone === "error" ? "alert" : "status"}
        className="relative w-[min(92vw,360px)] overflow-hidden rounded-xl border border-border-subtle bg-surface-light text-text-primary shadow-lg"
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <span
            aria-hidden
            className={`size-2.5 shrink-0 rounded-full ${tone === "error" ? "bg-brand-accent" : "bg-brand-primary"}`}
          />
          <p className="flex-1 text-sm">{message}</p>
          {action && (
            <button
              type="button"
              onClick={() => {
                action.onClick();
                toast.dismiss(id);
              }}
              className="touch-target -my-2 shrink-0 rounded-lg px-2 text-sm font-semibold text-brand-primary"
            >
              {action.label}
            </button>
          )}
        </div>
        <span
          aria-hidden
          className={`absolute bottom-0 left-0 h-1 w-full origin-left animate-toast-timer ${tone === "error" ? "bg-brand-accent" : "bg-brand-primary"}`}
          style={{ animationDuration: `${DURATION}ms` }}
        />
      </div>
    ),
    { duration: DURATION },
  );
}
