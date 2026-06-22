import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/badge";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { addContact, addDeal, addSubscription, addActivity, updateLifecycleStage } from "./actions";
import { AutoSubmitSelect } from "@/components/stage-select";
import { Avatar } from "@/components/avatar";

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: company }, { data: contacts }, { data: deals }, { data: subscriptions }, { data: activities }, { data: products }, { data: stages }] =
    await Promise.all([
      supabase.from("companies").select("*").eq("id", id).single(),
      supabase.from("contacts").select("*").eq("company_id", id).order("is_primary", { ascending: false }),
      supabase
        .from("deals")
        .select("*, products(name), pipeline_stages(name)")
        .eq("company_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("subscriptions")
        .select("*, products(name)")
        .eq("company_id", id)
        .order("renewal_date", { ascending: true }),
      supabase.from("activities").select("*").eq("company_id", id).order("created_at", { ascending: false }),
      supabase.from("products").select("*").order("name"),
      supabase.from("pipeline_stages").select("*").order("sort_order"),
    ]);

  if (!company) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/companies" className="text-sm text-stone-500 hover:text-brand">
          ← All companies
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <Avatar name={company.name} />
            <div>
              <h1 className="text-2xl font-semibold text-stone-900">{company.name}</h1>
              <p className="text-sm text-stone-500">
                {company.type ?? "—"} {company.website && `· ${company.website}`}
              </p>
            </div>
          </div>
          <form action={updateLifecycleStage.bind(null, id)}>
            <AutoSubmitSelect
              name="lifecycle_stage"
              defaultValue={company.lifecycle_stage}
              options={[
                { value: "lead", label: "Lead" },
                { value: "customer", label: "Customer" },
                { value: "churned", label: "Churned" },
              ]}
            />
          </form>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Contacts */}
        <section className="card">
          <h2 className="section-title mb-4">Contacts</h2>
          <ul className="mb-4 space-y-3">
            {contacts?.map((contact) => (
              <li key={contact.id} className="text-sm">
                <span className="font-medium text-stone-800">{contact.name}</span>
                {contact.is_primary && <span className="ml-1.5 text-xs text-brand">(primary)</span>}
                <div className="text-stone-500">
                  {contact.role && <span>{contact.role} · </span>}
                  {contact.email}
                  {contact.phone && ` · ${contact.phone}`}
                </div>
              </li>
            ))}
            {contacts?.length === 0 && <li className="text-sm text-stone-400">No contacts yet.</li>}
          </ul>
          <details className="disclosure">
            <summary>+ Add contact</summary>
            <form action={addContact.bind(null, id)} className="mt-3 space-y-2">
              <input name="name" placeholder="Name" required className="input-field" />
              <input name="role" placeholder="Role" className="input-field" />
              <input name="email" placeholder="Email" type="email" className="input-field" />
              <input name="phone" placeholder="Phone" className="input-field" />
              <label className="flex items-center gap-2 text-sm text-stone-600">
                <input type="checkbox" name="is_primary" /> Primary contact
              </label>
              <button type="submit" className="btn-primary">
                Add
              </button>
            </form>
          </details>
        </section>

        {/* Subscriptions */}
        <section className="card">
          <h2 className="section-title mb-4">Subscriptions</h2>
          <ul className="mb-4 space-y-3">
            {subscriptions?.map((sub) => {
              const days = daysUntil(sub.renewal_date);
              return (
                <li key={sub.id} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-stone-800">{(sub as any).products?.name}</span>
                    <Badge value={sub.status} />
                  </div>
                  <div className="text-stone-500">
                    {formatCurrency(sub.price)} · renews {formatDate(sub.renewal_date)}
                    {days !== null && days <= 60 && days >= 0 && (
                      <span className="ml-1 font-medium text-amber-600">({days}d)</span>
                    )}
                  </div>
                </li>
              );
            })}
            {subscriptions?.length === 0 && <li className="text-sm text-stone-400">No subscriptions yet.</li>}
          </ul>
          <details className="disclosure">
            <summary>+ Add subscription</summary>
            <form action={addSubscription.bind(null, id)} className="mt-3 space-y-2">
              <select name="product_id" required className="input-field">
                <option value="">Select product</option>
                {products?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <input name="start_date" type="date" required className="input-field" />
                <input name="renewal_date" type="date" className="input-field" />
              </div>
              <input name="price" type="number" step="0.01" placeholder="Price (£/yr)" className="input-field" />
              <select name="status" defaultValue="active" className="input-field">
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button type="submit" className="btn-primary">
                Add
              </button>
            </form>
          </details>
        </section>

        {/* Deals */}
        <section className="card">
          <h2 className="section-title mb-4">Deals</h2>
          <ul className="mb-4 space-y-3">
            {deals?.map((deal) => (
              <li key={deal.id} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-stone-800">{(deal as any).products?.name ?? "Deal"}</span>
                  <Badge value={deal.status} />
                </div>
                <div className="text-stone-500">
                  {(deal as any).pipeline_stages?.name} · {formatCurrency(deal.value)} · closes {formatDate(deal.expected_close_date)}
                </div>
              </li>
            ))}
            {deals?.length === 0 && <li className="text-sm text-stone-400">No deals yet.</li>}
          </ul>
          <details className="disclosure">
            <summary>+ Add deal</summary>
            <form action={addDeal.bind(null, id)} className="mt-3 space-y-2">
              <select name="product_id" required className="input-field">
                <option value="">Select product</option>
                {products?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <select name="contact_id" className="input-field">
                <option value="">No contact yet</option>
                {contacts?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input name="value" type="number" step="0.01" placeholder="Estimated value (£)" className="input-field" />
              <input name="expected_close_date" type="date" className="input-field" />
              <button type="submit" className="btn-primary">
                Add (starts at: {stages?.[0]?.name})
              </button>
            </form>
          </details>
        </section>

        {/* Activity */}
        <section className="card">
          <h2 className="section-title mb-4">Activity</h2>
          <form action={addActivity.bind(null, id)} className="mb-4 space-y-2">
            <select name="type" defaultValue="note" className="input-field">
              <option value="note">Note</option>
              <option value="call">Call</option>
              <option value="email">Email</option>
              <option value="demo">Demo</option>
            </select>
            <textarea name="body" required placeholder="Add a note…" className="input-field" rows={2} />
            <button type="submit" className="btn-primary">
              Add
            </button>
          </form>
          <ul className="max-h-72 space-y-4 overflow-y-auto">
            {activities?.map((activity) => (
              <li key={activity.id} className="text-sm">
                <div className="flex items-center gap-2">
                  <Badge value={activity.type} />
                  <span className="text-xs text-stone-400">{formatDate(activity.created_at)}</span>
                </div>
                <p className="mt-1.5 text-stone-700">{activity.body}</p>
              </li>
            ))}
            {activities?.length === 0 && <li className="text-sm text-stone-400">No activity yet.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
