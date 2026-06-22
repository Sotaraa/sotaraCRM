import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/badge";
import { Avatar } from "@/components/avatar";
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
        <h1 className="text-2xl font-semibold text-stone-900">Companies</h1>
      </div>

      <details className="disclosure card mb-6">
        <summary>+ Add company</summary>
        <form action={createCompany} className="mt-4 grid grid-cols-2 gap-3">
          <input name="name" placeholder="Company name" required className="input-field col-span-2" />
          <select name="type" defaultValue="School" className="input-field">
            <option value="School">School</option>
            <option value="Business">Business</option>
          </select>
          <select name="lifecycle_stage" defaultValue="lead" className="input-field">
            <option value="lead">Lead</option>
            <option value="customer">Customer</option>
            <option value="churned">Churned</option>
          </select>
          <input name="website" placeholder="Website" className="input-field" />
          <input name="source" placeholder="Source (e.g. referral, website)" className="input-field" />
          <input name="address" placeholder="Address" className="input-field col-span-2" />
          <button type="submit" className="btn-primary col-span-2 w-fit">
            Add company
          </button>
        </form>
      </details>

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
            {companies?.map((company) => (
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
            {companies?.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-stone-400">
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
