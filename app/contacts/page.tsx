import { createClient } from "@/lib/supabase/server";
import { ContactsTable } from "@/components/contacts-table";
import { createContactStandalone } from "@/lib/actions";

export default async function ContactsPage() {
  const supabase = await createClient();
  const [{ data: contacts }, { data: companies }] = await Promise.all([
    supabase.from("contacts").select("*, companies(id, name)").order("created_at", { ascending: false }),
    supabase.from("companies").select("id, name").order("name"),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-stone-900">Contacts</h1>

      <details className="disclosure card">
        <summary>+ Add contact</summary>
        <form action={createContactStandalone} className="mt-4 grid grid-cols-2 gap-3">
          <select name="company_id" required className="input-field col-span-2">
            <option value="">Select company</option>
            {companies?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input name="name" placeholder="Name" required className="input-field" />
          <input name="role" placeholder="Role" className="input-field" />
          <input name="email" placeholder="Email" type="email" className="input-field" />
          <input name="phone" placeholder="Phone" className="input-field" />
          <button type="submit" className="btn-primary col-span-2 w-fit">
            Add contact
          </button>
        </form>
      </details>

      {companies?.length === 0 ? (
        <p className="rounded-lg border border-dashed border-stone-300 p-6 text-center text-sm text-stone-400">
          Add a company first before adding contacts.
        </p>
      ) : (
        <ContactsTable contacts={(contacts as any) ?? []} />
      )}
    </div>
  );
}
