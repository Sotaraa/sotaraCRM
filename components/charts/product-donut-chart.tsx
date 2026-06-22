"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#1F2B49", "#BD6B3B", "#7C9885", "#9B7EBD", "#4F86A8"];

interface ProductDatum {
  name: string;
  value: number;
}

export function ProductDonutChart({ data }: { data: ProductDatum[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[230px] items-center justify-center text-sm text-stone-400">
        No active subscriptions yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={230}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={56}
          outerRadius={82}
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #E7E5E4",
            fontSize: 12,
            boxShadow: "0 8px 24px -8px rgb(31 27 20 / 0.18)",
          }}
          formatter={(value: number) => [`£${value.toLocaleString()}/yr`, "Revenue"]}
        />
        <Legend
          verticalAlign="bottom"
          height={40}
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => <span style={{ fontSize: 12, color: "#57534e" }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
