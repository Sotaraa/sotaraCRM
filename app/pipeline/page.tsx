import { createClient } from "@/lib/supabase/server";
import { KanbanBoard } from "@/components/kanban-board";
import { AutoSubmitSelect } from "@/components/stage-select";

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const supabase = await createClient();

  const [{ data: stages }, { data: products }] = await Promise.all([
    supabase.from("pipeline_stages").select("*").order("sort_order"),
    supabase.from("products").select("*").order("name"),
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
    <div>
      <div className="mb-6 flex items-center justify-between">
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
      <KanbanBoard stages={stages ?? []} deals={dealCards} />
    </div>
  );
}
