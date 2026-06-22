import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/avatar";

export default async function ContactsPage() {
  const supabase = await createClient();
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*, companies(id, name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-stone-900">Contacts</h1>
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {contacts?.map((contact) => (
              <tr key={contact.id}>
                <td className="font-medium text-stone-800">
                  <div className="flex items-center gap-3">
                    <Avatar name={contact.name} size="sm" />
                    {contact.name}
                  </div>
                </td>
                <td className="text-stone-600">{contact.role ?? "—"}</td>
                <td>
                  <Link href={`/companies/${(contact as any).companies?.id}`} className="link-accent">
                    {(contact as any).companies?.name}
                  </Link>
                </td>
                <td className="text-stone-600">{contact.email ?? "—"}</td>
                <td className="text-stone-600">{contact.phone ?? "—"}</td>
              </tr>
            ))}
            {contacts?.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-stone-400">
                  No contacts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
