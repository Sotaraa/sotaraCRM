"use client";

import { useTransition } from "react";
import { toggleTask } from "@/lib/actions";

export function TaskCheckbox({
  taskId,
  companyId,
  defaultChecked,
}: {
  taskId: string;
  companyId: string;
  defaultChecked: boolean;
}) {
  const [, startTransition] = useTransition();

  return (
    <input
      type="checkbox"
      defaultChecked={defaultChecked}
      onChange={(e) => startTransition(() => toggleTask(taskId, companyId, e.target.checked))}
      className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-stone-300 text-brand focus:ring-2 focus:ring-brand/20"
    />
  );
}
