import Link from "next/link";

type Props = {
  title: string;
  description: string;
  action?: { href: string; label: string };
};

export default function EmptyState({ title, description, action }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-border-subtle px-6 py-14 text-center">
      <h2 className="text-2xl text-brand-primary">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-text-muted">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="touch-target mt-6 inline-flex items-center justify-center rounded-lg border border-brand-primary px-5 font-semibold text-brand-primary hover:bg-brand-primary hover:text-surface-light"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
