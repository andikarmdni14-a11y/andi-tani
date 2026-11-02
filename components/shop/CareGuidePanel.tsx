import { DropIcon, GaugeIcon, SproutIcon, SunIcon } from "@/components/ui/icons";
import type { CareGuide } from "@/types/database";

export function CareFacts({ guide }: { guide: CareGuide }) {
  const facts = [
    { icon: SunIcon, label: "Cahaya", value: guide.light_requirement },
    { icon: DropIcon, label: "Penyiraman", value: guide.watering_frequency },
    { icon: SproutIcon, label: "Pupuk", value: guide.fertilizer_type },
    { icon: GaugeIcon, label: "Tingkat kesulitan", value: guide.difficulty_level },
  ].filter((fact) => fact.value);

  if (facts.length === 0) return null;

  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {facts.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex gap-3">
          <Icon className="mt-0.5 size-6 shrink-0 text-brand-primary" />
          <div>
            <dt className="text-sm text-text-muted">{label}</dt>
            <dd className="font-semibold">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

export default function CareGuidePanel({ guide }: { guide: CareGuide }) {
  return (
    <details open className="group rounded-2xl border border-border-subtle bg-logo-surface">
      <summary className="touch-target flex cursor-pointer list-none items-center justify-between px-5 font-semibold">
        Cara merawat
        <span aria-hidden className="text-xl text-text-muted group-open:rotate-45">+</span>
      </summary>
      <div className="px-5 pb-5">
        <p className="mb-4 text-sm text-text-muted">{guide.name}</p>
        <CareFacts guide={guide} />
      </div>
    </details>
  );
}
