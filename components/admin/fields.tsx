import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const control =
  "mt-1 w-full rounded-lg border border-border-subtle bg-surface-light px-3 text-text-primary aria-[invalid=true]:border-brand-accent";

function Wrapper({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-brand-accent">{error}</p>
      )}
    </div>
  );
}

type Common = { id: string; label: string; error?: string; hint?: string };

export function TextField({ id, label, error, hint, ...props }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <input id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} className={`${control} h-11`} {...props} />
    </Wrapper>
  );
}

export function TextAreaField({ id, label, error, hint, ...props }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <textarea id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} className={`${control} min-h-28 py-2`} {...props} />
    </Wrapper>
  );
}

export function SelectField({ id, label, error, hint, children, ...props }: Common & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <select id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} className={`${control} h-11`} {...props}>
        {children}
      </select>
    </Wrapper>
  );
}

export function FormMessage({ tone, children }: { tone: "error" | "success"; children: ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-lg px-4 py-3 text-sm ${tone === "error" ? "bg-brand-accent/10 text-brand-accent" : "bg-brand-primary/10 text-brand-primary"}`}
    >
      {children}
    </p>
  );
}

export const primaryButton =
  "touch-target inline-flex items-center justify-center rounded-lg bg-brand-primary px-5 font-semibold text-surface-light hover:bg-brand-accent disabled:cursor-wait disabled:opacity-60";
export const secondaryButton =
  "touch-target inline-flex items-center justify-center rounded-lg border border-border-subtle px-4 text-sm font-semibold hover:border-brand-primary";
export const dangerButton =
  "touch-target inline-flex items-center justify-center rounded-lg px-4 text-sm font-semibold text-brand-accent hover:bg-brand-accent/10";
