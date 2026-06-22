"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { DeleteButton } from "@/components/delete-button";
import { deleteContact } from "@/lib/actions";

interface ContactRow {
  id: string;
  company_id: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  companies: { id: string; name: string } | null;
}

export function ContactsTable({ contacts }: { contacts: ContactRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        (c.companies?.name ?? "").toLowerCase().includes(q)
    );
  }, [contacts, query]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-xs">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search contacts…"
          className="input-field pl-9"
        />
      </div>

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((contact) => (
              <tr key={contact.id}>
                <td className="font-medium text-stone-800">
                  <div className="flex items-center gap-3">
                    <Avatar name={contact.name} size="sm" />
                    {contact.name}
                  </div>
                </td>
                <td className="text-stone-600">{contact.role ?? "—"}</td>
                <td>
                  <Link href={`/companies/${contact.companies?.id}`} className="link-accent">
                    {contact.companies?.name}
                  </Link>
                </td>
                <td className="text-stone-600">{contact.email ?? "—"}</td>
                <td className="text-stone-600">{contact.phone ?? "—"}</td>
                <td>
                  <form action={deleteContact.bind(null, contact.id, contact.company_id)}>
                    <DeleteButton confirmText={`Delete ${contact.name}?`} />
                  </form>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-stone-400">
                  {contacts.length === 0 ? "No contacts yet. Add one above." : "No matches."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
