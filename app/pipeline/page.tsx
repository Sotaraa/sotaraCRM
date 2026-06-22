import { createClient } from "@/lib/supabase/server";
import { KanbanBoard } from "@/components/kanban-board";
import { AutoSubmitSelect } from "@/components/stage-select";
import { createDealStandalone } from "@/lib/actions";

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const supabase = await createClient();

  const [{ data: stages }, { data: products }, { data: companies }] = await Promise.all([
    supabase.from("pipeline_stages").select("*").order("sort_order"),
    supabase.from("products").select("*").order("name"),
    supabase.from("companies").select("id, name").order("name"),
  ]);

  let query = supabase
    .from("deals")
    .select("id, company_id, value, stage_id, status, companies(name), products(name, id)")
    .eq("status", "open");

  if (product) query = query.eq("product_id", product);

  const { data: deals } = await query;

  const dealCards = (deals ?? []).map((deal: any) => ({
    id: deal.id,
    company_id: deal.company_id,
    company_name: deal.companies?.name ?? "Unknown",
    product_name: deal.products?.name ?? null,
    value: deal.value,
    stage_id: deal.stage_id,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-900">Pipeline</h1>
        <form className="flex items-center gap-2">
          <label className="text-sm text-stone-500">Product</label>
          <AutoSubmitSelect
            name="product"
            defaultValue={product ?? ""}
            options={[{ value: "", label: "All products" }, ...(products ?? []).map((p) => ({ value: p.id, label: p.name }))]}
          />
          <noscript>
            <button type="submit" className="btn-secondary">
              Filter
            </button>
          </noscript>
        </form>
      </div>

      <details className="disclosure card">
        <summary>+ Add deal</summary>
        <form action={createDealStandalone} className="mt-4 grid grid-cols-2 gap-3">
          <select name="company_id" required className="input-field">
            <option value="">Select company</option>
            {companies?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select name="product_id" required className="input-field">
            <option value="">Select product</option>
            {products?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input name="value" type="number" step="0.01" placeholder="Estimated value (£)" className="input-field" />
          <input name="expected_close_date" type="date" className="input-field" />
          <button type="submit" className="btn-primary col-span-2 w-fit">
            Add deal (starts at: {stages?.[0]?.name})
          </button>
        </form>
      </details>

      {companies?.length === 0 ? (
        <p className="rounded-lg border border-dashed border-stone-300 p-6 text-center text-sm text-stone-400">
          Add a company first, then deals can be created here or from a company&apos;s page.
        </p>
      ) : (
        <KanbanBoard stages={stages ?? []} deals={dealCards} />
      )}
    </div>
  );
}
