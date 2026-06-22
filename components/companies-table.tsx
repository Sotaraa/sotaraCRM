"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Badge } from "@/components/badge";
import { Avatar } from "@/components/avatar";

interface CompanyRow {
  id: string;
  name: string;
  type: string | null;
  lifecycle_stage: string;
  website: string | null;
}

export function CompaniesTable({ companies }: { companies: CompanyRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.type ?? "").toLowerCase().includes(q)
    );
  }, [companies, query]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-xs">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search companies…"
          className="input-field pl-9"
        />
      </div>

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Stage</th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((company) => (
              <tr key={company.id}>
                <td>
                  <Link href={`/companies/${company.id}`} className="flex items-center gap-3">
                    <Avatar name={company.name} size="sm" />
                    <span className="link-accent">{company.name}</span>
                  </Link>
                </td>
                <td className="text-stone-600">{company.type ?? "—"}</td>
                <td>
                  <Badge value={company.lifecycle_stage} />
                </td>
                <td className="text-stone-600">{company.website ?? "—"}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-stone-400">
                  {companies.length === 0 ? "No companies yet. Add your first lead above." : "No matches."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
