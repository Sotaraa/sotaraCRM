"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { updateDealStage } from "@/app/pipeline/actions";
import { formatCurrency } from "@/lib/format";

interface DealCard {
  id: string;
  company_id: string;
  company_name: string;
  product_name: string | null;
  value: number | null;
  stage_id: string;
}

interface Stage {
  id: string;
  name: string;
}

export function KanbanBoard({ stages, deals }: { stages: Stage[]; deals: DealCard[] }) {
  const [items, setItems] = useState(deals);
  const [, startTransition] = useTransition();
  const [dragging, setDragging] = useState<string | null>(null);

  function onDrop(stageId: string) {
    if (!dragging) return;
    const dealId = dragging;
    setDragging(null);

    setItems((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage_id: stageId } : d)));

    const targetStage = stages.find((s) => s.id === stageId);
    const isWon = targetStage?.name.toLowerCase() === "won";
    const isLost = targetStage?.name.toLowerCase() === "lost";

    startTransition(async () => {
      await updateDealStage(dealId, stageId, !!isWon, !!isLost);
    });
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageDeals = items.filter((d) => d.stage_id === stage.id);
        const total = stageDeals.reduce((sum, d) => sum + (d.value ?? 0), 0);

        return (
          <div
            key={stage.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(stage.id)}
            className="w-64 flex-shrink-0 rounded-lg bg-slate-100 p-3"
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-slate-700">{stage.name}</h3>
              <span className="text-xs text-slate-400">{formatCurrency(total)}</span>
            </div>
            <div className="space-y-2">
              {stageDeals.map((deal) => (
                <div
                  key={deal.id}
                  draggable
                  onDragStart={() => setDragging(deal.id)}
                  className="cursor-grab rounded-md border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing"
                >
                  <Link href={`/companies/${deal.company_id}`} className="text-sm font-medium text-brand">
                    {deal.company_name}
                  </Link>
                  <div className="mt-1 text-xs text-slate-500">{deal.product_name ?? "—"}</div>
                  <div className="mt-1 text-xs font-medium text-slate-700">{formatCurrency(deal.value)}</div>
                </div>
              ))}
              {stageDeals.length === 0 && (
                <div className="rounded-md border border-dashed border-slate-300 p-3 text-center text-xs text-slate-400">
                  Drop here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
