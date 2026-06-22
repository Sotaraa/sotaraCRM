const PALETTE = [
  { bg: "bg-brand-tint", text: "text-brand" },
  { bg: "bg-emerald-50", text: "text-emerald-700" },
  { bg: "bg-amber-50", text: "text-amber-700" },
  { bg: "bg-rose-50", text: "text-rose-700" },
  { bg: "bg-violet-50", text: "text-violet-700" },
  { bg: "bg-sky-50", text: "text-sky-700" },
];

function hash(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const { bg, text } = PALETTE[hash(name) % PALETTE.length];
  const dimensions = size === "sm" ? "h-7 w-7 text-[11px]" : "h-9 w-9 text-xs";

  return (
    <span
      className={`flex flex-shrink-0 items-center justify-center rounded-full font-display font-semibold ${bg} ${text} ${dimensions}`}
    >
      {initials || "?"}
    </span>
  );
}
