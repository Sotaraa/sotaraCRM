import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/badge";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: openDeals }, { data: stages }, { data: renewals }, { data: activities }] = await Promise.all([
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
  ]);

  const pipelineValue = (openDeals ?? []).reduce((sum, d) => sum + (d.value ?? 0), 0);
  const dealsByStage = (stages ?? []).map((stage) => {
    const inStage = (openDeals ?? []).filter((d) => d.stage_id === stage.id);
    return {
      stage,
      count: inStage.length,
      value: inStage.reduce((sum, d) => sum + (d.value ?? 0), 0),
    };
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Open pipeline value</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{formatCurrency(pipelineValue)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Open deals</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{openDeals?.length ?? 0}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Renewals next 60 days</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{renewals?.length ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Deals by stage</h2>
            <Link href="/pipeline" className="text-sm text-brand">
              View pipeline →
            </Link>
          </div>
          <ul className="space-y-2">
            {dealsByStage.map(({ stage, count, value }) => (
              <li key={stage.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{stage.name}</span>
                <span className="text-slate-500">
                  {count} · {formatCurrency(value)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Upcoming renewals</h2>
          <ul className="space-y-2">
            {renewals?.map((sub) => {
              const days = daysUntil(sub.renewal_date);
              return (
                <li key={sub.id} className="text-sm">
                  <div className="flex items-center justify-between">
                    <Link href={`/companies/${(sub as any).companies?.id}`} className="font-medium text-brand">
                      {(sub as any).companies?.name}
                    </Link>
                    <span className="text-xs font-medium text-amber-600">{days}d</span>
                  </div>
                  <div className="text-slate-500">
                    {(sub as any).products?.name} · renews {formatDate(sub.renewal_date)}
                  </div>
                </li>
              );
            })}
            {renewals?.length === 0 && <li className="text-sm text-slate-400">No renewals coming up.</li>}
          </ul>
        </section>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Recent activity</h2>
        <ul className="space-y-3">
          {activities?.map((activity) => (
            <li key={activity.id} className="text-sm">
              <div className="flex items-center gap-2">
                <Badge value={activity.type} />
                <Link href={`/companies/${(activity as any).companies?.id}`} className="font-medium text-brand">
                  {(activity as any).companies?.name}
                </Link>
                <span className="text-xs text-slate-400">{formatDate(activity.created_at)}</span>
              </div>
              <p className="mt-1 text-slate-700">{activity.body}</p>
            </li>
          ))}
          {activities?.length === 0 && <li className="text-sm text-slate-400">No activity yet.</li>}
        </ul>
      </section>
    </div>
  );
}
