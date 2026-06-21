import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/badge";
import { createCompany } from "./actions";

export default async function CompaniesPage() {
  const supabase = await createClient();
  const { data: companies } = await supabase
    .from("companies")
    .select("id, name, type, lifecycle_stage, website, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Companies</h1>
      </div>

      <details className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-medium text-brand">+ Add company</summary>
        <form action={createCompany} className="mt-4 grid grid-cols-2 gap-3">
          <input
            name="name"
            placeholder="Company name"
            required
            className="col-span-2 rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            name="type"
            defaultValue="School"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="School">School</option>
            <option value="Business">Business</option>
          </select>
          <select
            name="lifecycle_stage"
            defaultValue="lead"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="lead">Lead</option>
            <option value="customer">Customer</option>
            <option value="churned">Churned</option>
          </select>
          <input
            name="website"
            placeholder="Website"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            name="source"
            placeholder="Source (e.g. referral, website)"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            name="address"
            placeholder="Address"
            className="col-span-2 rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="col-span-2 w-fit rounded bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            Add company
          </button>
        </form>
      </details>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Website</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {companies?.map((company) => (
              <tr key={company.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/companies/${company.id}`} className="font-medium text-brand">
                    {company.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{company.type ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge value={company.lifecycle_stage} />
                </td>
                <td className="px-4 py-3 text-slate-600">{company.website ?? "—"}</td>
              </tr>
            ))}
            {companies?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  No companies yet. Add your first lead above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
