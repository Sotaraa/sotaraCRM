"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface StageDatum {
  name: string;
  value: number;
  count: number;
}

export function StageBarChart({ data }: { data: StageDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={230}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#E7E5E4" strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#78716c" }}
          axisLine={false}
          tickLine={false}
          interval={0}
        />
        <YAxis tick={{ fontSize: 11, fill: "#78716c" }} axisLine={false} tickLine={false} width={44} />
        <Tooltip
          cursor={{ fill: "rgba(31,43,73,0.06)" }}
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #E7E5E4",
            fontSize: 12,
            boxShadow: "0 8px 24px -8px rgb(31 27 20 / 0.18)",
          }}
          formatter={((value: number, _name: string, item: any) => [
            `£${value.toLocaleString()} · ${item.payload.count} deals`,
            "Value",
          ]) as any}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#1F2B49" maxBarSize={38} />
      </BarChart>
    </ResponsiveContainer>
  );
}
