import Link from "next/link";
import { Banknote, Layers, CalendarClock, ListChecks } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/badge";
import { Avatar } from "@/components/avatar";
import { StatCard } from "@/components/stat-card";
import { TaskCheckbox } from "@/components/task-checkbox";
import { StageBarChart } from "@/components/charts/stage-bar-chart";
import { ProductDonutChart } from "@/components/charts/product-donut-chart";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: openDeals }, { data: stages }, { data: renewals }, { data: activities }, { data: tasks }, { data: activeSubs }] =
    await Promise.all([
      supabase.from("deals").select("value, stage_id, companies(name)").eq("status", "open"),
      supabase.from("pipeline_stages").select("*").order("sort_order"),
      supabase
        .from("subscriptions")
        .select("*, companies(id, name), products(name)")
        .eq("status", "active")
        .not("renewal_date", "is", null)
        .lte("renewal_date", new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
        .order("renewal_date", { ascending: true }),
      supabase
        .from("activities")
        .select("*, companies(id, name)")
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("tasks")
        .select("*, companies(id, name)")
        .eq("status", "open")
        .order("due_date", { ascending: true, nullsFirst: false })
        .limit(8),
      supabase.from("subscriptions").select("price, products(name)").eq("status", "active"),
    ]);

  const pipelineValue = (openDeals ?? []).reduce((sum, d) => sum + (d.value ?? 0), 0);
  const dealsByStage = (stages ?? []).map((stage) => {
    const inStage = (openDeals ?? []).filter((d) => d.stage_id === stage.id);
    return {
      name: stage.name,
      count: inStage.length,
      value: inStage.reduce((sum, d) => sum + (d.value ?? 0), 0),
    };
  });

  const revenueByProduct = Object.values(
    (activeSubs ?? []).reduce((acc: Record<string, { name: string; value: number }>, sub: any) => {
      const name = sub.products?.name ?? "Other";
      acc[name] = acc[name] ?? { name, value: 0 };
      acc[name].value += sub.price ?? 0;
      return acc;
    }, {})
  );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-stone-900">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Open pipeline value" value={formatCurrency(pipelineValue)} icon={Banknote} tint="brand" />
        <StatCard label="Open deals" value={openDeals?.length ?? 0} icon={Layers} tint="accent" />
        <StatCard label="Renewals next 60 days" value={renewals?.length ?? 0} icon={CalendarClock} tint="emerald" />
        <StatCard label="Open tasks" value={tasks?.length ?? 0} icon={ListChecks} tint="amber" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <section className="card">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="section-title">Deals by stage</h2>
            <Link href="/pipeline" className="link-accent text-sm">
              View pipeline →
            </Link>
          </div>
          <StageBarChart data={dealsByStage} />
        </section>

        <section className="card">
          <h2 className="section-title mb-2">Revenue by product</h2>
          <ProductDonutChart data={revenueByProduct} />
        </section>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <section className="card">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="section-title">Tasks due</h2>
            <Link href="/tasks" className="link-accent text-sm">
              View all →
            </Link>
          </div>
          <ul className="space-y-3">
            {tasks?.map((task) => {
              const days = daysUntil(task.due_date);
              const overdue = days !== null && days < 0;
              const companyName = (task as any).companies?.name ?? "Unknown";
              return (
                <li key={task.id} className="flex items-start gap-2.5 text-sm">
                  <TaskCheckbox taskId={task.id} companyId={task.company_id} defaultChecked={false} />
                  <div className="min-w-0 flex-1">
                    <p className="text-stone-800">{task.title}</p>
                    <div className="text-stone-500">
                      <Link href={`/companies/${(task as any).companies?.id}`} className="link-accent">
                        {companyName}
                      </Link>
                      {task.due_date && (
                        <span className={overdue ? "ml-1 font-medium text-red-600" : "ml-1"}>
                          · due {formatDate(task.due_date)}
                          {overdue && " (overdue)"}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
            {tasks?.length === 0 && <li className="text-sm text-stone-400">No open tasks.</li>}
          </ul>
        </section>

        <section className="card">
          <h2 className="section-title mb-5">Upcoming renewals</h2>
          <ul className="space-y-4">
            {renewals?.map((sub) => {
              const days = daysUntil(sub.renewal_date);
              const companyName = (sub as any).companies?.name ?? "Unknown";
              return (
                <li key={sub.id} className="flex items-center gap-3 text-sm">
                  <Avatar name={companyName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <Link href={`/companies/${(sub as any).companies?.id}`} className="link-accent truncate">
                        {companyName}
                      </Link>
                      <span className="ml-2 flex-shrink-0 text-xs font-medium text-amber-600">{days}d</span>
                    </div>
                    <div className="text-stone-500">
                      {(sub as any).products?.name} · renews {formatDate(sub.renewal_date)}
                    </div>
                  </div>
                </li>
              );
            })}
            {renewals?.length === 0 && <li className="text-sm text-stone-400">No renewals coming up.</li>}
          </ul>
        </section>
      </div>

      <section className="card">
        <h2 className="section-title mb-5">Recent activity</h2>
        <ul className="grid grid-cols-2 gap-x-8 gap-y-4">
          {activities?.map((activity) => {
            const companyName = (activity as any).companies?.name ?? "Unknown";
            return (
              <li key={activity.id} className="flex gap-3 text-sm">
                <Avatar name={companyName} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <Link href={`/companies/${(activity as any).companies?.id}`} className="link-accent">
                      {companyName}
                    </Link>
                    <Badge value={activity.type} />
                    <span className="text-xs text-stone-400">{formatDate(activity.created_at)}</span>
                  </div>
                  <p className="mt-1 text-stone-700">{activity.body}</p>
                </div>
              </li>
            );
          })}
          {activities?.length === 0 && <li className="text-sm text-stone-400">No activity yet.</li>}
        </ul>
      </section>
    </div>
  );
}
