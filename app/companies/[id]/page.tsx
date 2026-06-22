import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/badge";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { addContact, addDeal, addSubscription, addActivity, updateLifecycleStage } from "./actions";
import {
  updateCompany,
  deleteCompany,
  updateContact,
  deleteContact,
  updateDeal,
  deleteDeal,
  updateSubscription,
  deleteSubscription,
  deleteActivity,
  addTask,
  deleteTask,
} from "@/lib/actions";
import { AutoSubmitSelect } from "@/components/stage-select";
import { Avatar } from "@/components/avatar";
import { DeleteButton } from "@/components/delete-button";
import { TaskCheckbox } from "@/components/task-checkbox";

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: company }, { data: contacts }, { data: deals }, { data: subscriptions }, { data: activities }, { data: products }, { data: stages }, { data: tasks }] =
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
      supabase.from("tasks").select("*").eq("company_id", id).order("due_date", { ascending: true, nullsFirst: false }),
    ]);

  if (!company) notFound();

  const openTasks = tasks?.filter((t) => t.status === "open") ?? [];
  const doneTasks = tasks?.filter((t) => t.status === "done") ?? [];

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

        <div className="mt-4 flex gap-4">
          <details className="disclosure">
            <summary>Edit company</summary>
            <form action={updateCompany.bind(null, id)} className="mt-3 grid grid-cols-2 gap-2">
              <input name="name" defaultValue={company.name} required className="input-field col-span-2" />
              <input name="type" defaultValue={company.type ?? ""} placeholder="Type" className="input-field" />
              <input name="website" defaultValue={company.website ?? ""} placeholder="Website" className="input-field" />
              <input name="source" defaultValue={company.source ?? ""} placeholder="Source" className="input-field" />
              <input name="address" defaultValue={company.address ?? ""} placeholder="Address" className="input-field" />
              <button type="submit" className="btn-primary col-span-2 w-fit">
                Save
              </button>
            </form>
          </details>
          <form action={deleteCompany.bind(null, id)}>
            <DeleteButton confirmText={`Delete ${company.name} and everything attached to it (contacts, deals, subscriptions, tasks)? This can't be undone.`} />
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
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-stone-800">{contact.name}</span>
                    {contact.is_primary && <span className="ml-1.5 text-xs text-brand">(primary)</span>}
                    <div className="text-stone-500">
                      {contact.role && <span>{contact.role} · </span>}
                      {contact.email}
                      {contact.phone && ` · ${contact.phone}`}
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <form action={deleteContact.bind(null, contact.id, id)}>
                      <DeleteButton confirmText={`Delete ${contact.name}?`} />
                    </form>
                  </div>
                </div>
                <details className="disclosure">
                  <summary className="text-xs">Edit</summary>
                  <form action={updateContact.bind(null, contact.id, id)} className="mt-2 space-y-2 rounded-md bg-stone-50 p-3">
                    <input name="name" defaultValue={contact.name} required className="input-field" />
                    <input name="role" defaultValue={contact.role ?? ""} placeholder="Role" className="input-field" />
                    <input name="email" defaultValue={contact.email ?? ""} placeholder="Email" className="input-field" />
                    <input name="phone" defaultValue={contact.phone ?? ""} placeholder="Phone" className="input-field" />
                    <label className="flex items-center gap-2 text-sm text-stone-600">
                      <input type="checkbox" name="is_primary" defaultChecked={contact.is_primary} /> Primary contact
                    </label>
                    <button type="submit" className="btn-primary">
                      Save
                    </button>
                  </form>
                </details>
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
                    <div className="flex items-center gap-2">
                      <Badge value={sub.status} />
                      <form action={deleteSubscription.bind(null, sub.id, id)}>
                        <DeleteButton confirmText="Delete this subscription?" />
                      </form>
                    </div>
                  </div>
                  <div className="text-stone-500">
                    {formatCurrency(sub.price)} · renews {formatDate(sub.renewal_date)}
                    {days !== null && days <= 60 && days >= 0 && (
                      <span className="ml-1 font-medium text-amber-600">({days}d)</span>
                    )}
                  </div>
                  <details className="disclosure">
                    <summary className="text-xs">Edit</summary>
                    <form action={updateSubscription.bind(null, sub.id, id)} className="mt-2 space-y-2 rounded-md bg-stone-50 p-3">
                      <select name="product_id" defaultValue={sub.product_id} required className="input-field">
                        {products?.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <input name="start_date" type="date" defaultValue={sub.start_date} required className="input-field" />
                        <input name="renewal_date" type="date" defaultValue={sub.renewal_date ?? ""} className="input-field" />
                      </div>
                      <input name="price" type="number" step="0.01" defaultValue={sub.price ?? ""} className="input-field" />
                      <select name="status" defaultValue={sub.status} className="input-field">
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button type="submit" className="btn-primary">
                        Save
                      </button>
                    </form>
                  </details>
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
                  <div className="flex items-center gap-2">
                    <Badge value={deal.status} />
                    <form action={deleteDeal.bind(null, deal.id, id)}>
                      <DeleteButton confirmText="Delete this deal?" />
                    </form>
                  </div>
                </div>
                <div className="text-stone-500">
                  {(deal as any).pipeline_stages?.name} · {formatCurrency(deal.value)} · closes {formatDate(deal.expected_close_date)}
                </div>
                <details className="disclosure">
                  <summary className="text-xs">Edit</summary>
                  <form action={updateDeal.bind(null, deal.id, id)} className="mt-2 space-y-2 rounded-md bg-stone-50 p-3">
                    <select name="product_id" defaultValue={deal.product_id ?? ""} className="input-field">
                      {products?.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <input name="value" type="number" step="0.01" defaultValue={deal.value ?? ""} placeholder="Value" className="input-field" />
                    <input name="expected_close_date" type="date" defaultValue={deal.expected_close_date ?? ""} className="input-field" />
                    <button type="submit" className="btn-primary">
                      Save
                    </button>
                  </form>
                </details>
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

        {/* Tasks */}
        <section className="card">
          <h2 className="section-title mb-4">Tasks</h2>
          <ul className="mb-4 space-y-3">
            {openTasks.map((task) => {
              const days = daysUntil(task.due_date);
              const overdue = days !== null && days < 0;
              return (
                <li key={task.id} className="flex items-start gap-2.5 text-sm">
                  <TaskCheckbox taskId={task.id} companyId={id} defaultChecked={false} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-stone-800">{task.title}</p>
                      <form action={deleteTask.bind(null, task.id, id)}>
                        <DeleteButton confirmText="Delete this task?" />
                      </form>
                    </div>
                    {task.due_date && (
                      <p className={overdue ? "font-medium text-red-600" : "text-stone-500"}>
                        due {formatDate(task.due_date)}
                        {overdue && " (overdue)"}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
            {openTasks.length === 0 && <li className="text-sm text-stone-400">No open tasks.</li>}
          </ul>
          {doneTasks.length > 0 && (
            <details className="disclosure mb-4">
              <summary className="text-xs">Completed ({doneTasks.length})</summary>
              <ul className="mt-2 space-y-2">
                {doneTasks.map((task) => (
                  <li key={task.id} className="flex items-start gap-2.5 text-sm text-stone-400">
                    <TaskCheckbox taskId={task.id} companyId={id} defaultChecked />
                    <p className="line-through">{task.title}</p>
                  </li>
                ))}
              </ul>
            </details>
          )}
          <details className="disclosure">
            <summary>+ Add task</summary>
            <form action={addTask.bind(null, id)} className="mt-3 space-y-2">
              <input name="title" placeholder="e.g. Call back next week" required className="input-field" />
              <input name="due_date" type="date" className="input-field" />
              <button type="submit" className="btn-primary">
                Add
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge value={activity.type} />
                    <span className="text-xs text-stone-400">{formatDate(activity.created_at)}</span>
                  </div>
                  <form action={deleteActivity.bind(null, activity.id, id)}>
                    <DeleteButton confirmText="Delete this activity?" />
                  </form>
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
