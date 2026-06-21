const STYLES: Record<string, string> = {
  lead: "bg-amber-100 text-amber-800",
  customer: "bg-emerald-100 text-emerald-800",
  churned: "bg-slate-200 text-slate-600",
  active: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-slate-200 text-slate-600",
  paused: "bg-amber-100 text-amber-800",
  open: "bg-blue-100 text-blue-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-red-100 text-red-700",
};

export function Badge({ value }: { value: string }) {
  const style = STYLES[value] ?? "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}>
      {value}
    </span>
  );
}
