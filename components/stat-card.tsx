import type { LucideIcon } from "lucide-react";

const TINTS = {
  brand: { bg: "bg-brand-tint", text: "text-brand" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-700" },
  amber: { bg: "bg-amber-100", text: "text-amber-700" },
  accent: { bg: "bg-accent-tint", text: "text-accent-dark" },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tint = "brand",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tint?: keyof typeof TINTS;
}) {
  const { bg, text } = TINTS[tint];

  return (
    <div className="card flex items-start justify-between">
      <div>
        <p className="section-title">{label}</p>
        <p className="mt-2 font-display text-3xl font-semibold text-stone-900">{value}</p>
      </div>
      <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${bg} ${text}`}>
        <Icon size={19} strokeWidth={2} />
      </span>
    </div>
  );
}
