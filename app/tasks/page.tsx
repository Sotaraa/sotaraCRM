import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addTaskStandalone, deleteTask } from "@/lib/actions";
import { TaskCheckbox } from "@/components/task-checkbox";
import { DeleteButton } from "@/components/delete-button";
import { formatDate, daysUntil } from "@/lib/format";

export default async function TasksPage() {
  const supabase = await createClient();

  const [{ data: companies }, { data: openTasks }, { data: doneTasks }] = await Promise.all([
    supabase.from("companies").select("id, name").order("name"),
    supabase
      .from("tasks")
      .select("*, companies(id, name)")
      .eq("status", "open")
      .order("due_date", { ascending: true, nullsFirst: false }),
    supabase
      .from("tasks")
      .select("*, companies(id, name)")
      .eq("status", "done")
      .order("completed_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-stone-900">Tasks</h1>

      <details className="disclosure card">
        <summary>+ Add task</summary>
        <form action={addTaskStandalone} className="mt-4 grid grid-cols-2 gap-3">
          <input name="title" placeholder="e.g. Call back about renewal" required className="input-field col-span-2" />
          <select name="company_id" required className="input-field">
            <option value="">Select company</option>
            {companies?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input name="due_date" type="date" className="input-field" />
          <button type="submit" className="btn-primary col-span-2 w-fit">
            Add task
          </button>
        </form>
      </details>

      <section className="card">
        <h2 className="section-title mb-4">Open ({openTasks?.length ?? 0})</h2>
        <ul className="space-y-3">
          {openTasks?.map((task) => {
            const days = daysUntil(task.due_date);
            const overdue = days !== null && days < 0;
            return (
              <li key={task.id} className="flex items-start gap-3 text-sm">
                <TaskCheckbox taskId={task.id} companyId={task.company_id} defaultChecked={false} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-stone-800">{task.title}</p>
                    <form action={deleteTask.bind(null, task.id, task.company_id)}>
                      <DeleteButton confirmText="Delete this task?" />
                    </form>
                  </div>
                  <div className="text-stone-500">
                    <Link href={`/companies/${(task as any).companies?.id}`} className="link-accent">
                      {(task as any).companies?.name}
                    </Link>
                    {task.due_date && (
                      <span className={overdue ? "ml-2 font-medium text-red-600" : "ml-2"}>
                        · due {formatDate(task.due_date)}
                        {overdue && " (overdue)"}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
          {openTasks?.length === 0 && <li className="text-sm text-stone-400">No open tasks. Add one above.</li>}
        </ul>
      </section>

      <details className="disclosure card">
        <summary>Completed ({doneTasks?.length ?? 0})</summary>
        <ul className="mt-4 space-y-3">
          {doneTasks?.map((task) => (
            <li key={task.id} className="flex items-start gap-3 text-sm text-stone-400">
              <TaskCheckbox taskId={task.id} companyId={task.company_id} defaultChecked />
              <div className="min-w-0 flex-1">
                <p className="line-through">{task.title}</p>
                <Link href={`/companies/${(task as any).companies?.id}`} className="text-stone-400 hover:text-brand">
                  {(task as any).companies?.name}
                </Link>
              </div>
            </li>
          ))}
          {doneTasks?.length === 0 && <li className="text-sm text-stone-400">Nothing completed yet.</li>}
        </ul>
      </details>
    </div>
  );
}
