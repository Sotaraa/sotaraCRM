const STYLES: Record<string, { dot: string; text: string }> = {
  lead: { dot: "bg-amber-500", text: "text-amber-700" },
  customer: { dot: "bg-emerald-600", text: "text-emerald-700" },
  churned: { dot: "bg-stone-400", text: "text-stone-500" },
  active: { dot: "bg-emerald-600", text: "text-emerald-700" },
  cancelled: { dot: "bg-stone-400", text: "text-stone-500" },
  paused: { dot: "bg-amber-500", text: "text-amber-700" },
  open: { dot: "bg-brand", text: "text-brand" },
  won: { dot: "bg-emerald-600", text: "text-emerald-700" },
  lost: { dot: "bg-red-500", text: "text-red-600" },
  note: { dot: "bg-stone-400", text: "text-stone-500" },
  call: { dot: "bg-brand", text: "text-brand" },
  email: { dot: "bg-amber-500", text: "text-amber-700" },
  demo: { dot: "bg-emerald-600", text: "text-emerald-700" },
};

export function Badge({ value }: { value: string }) {
  const style = STYLES[value] ?? { dot: "bg-stone-400", text: "text-stone-500" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium capitalize ${style.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {value}
    </span>
  );
}
