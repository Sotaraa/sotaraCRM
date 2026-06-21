import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ContactsPage() {
  const supabase = await createClient();
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*, companies(id, name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Contacts</h1>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contacts?.map((contact) => (
              <tr key={contact.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{contact.name}</td>
                <td className="px-4 py-3 text-slate-600">{contact.role ?? "—"}</td>
                <td className="px-4 py-3">
                  <Link href={`/companies/${(contact as any).companies?.id}`} className="text-brand">
                    {(contact as any).companies?.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{contact.email ?? "—"}</td>
                <td className="px-4 py-3 text-slate-600">{contact.phone ?? "—"}</td>
              </tr>
            ))}
            {contacts?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
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
