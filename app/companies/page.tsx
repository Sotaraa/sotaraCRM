import { createClient } from "@/lib/supabase/server";
import { CompaniesTable } from "@/components/companies-table";
import { createCompany } from "./actions";

export default async function CompaniesPage() {
  const supabase = await createClient();
  const { data: companies } = await supabase
    .from("companies")
    .select("id, name, type, lifecycle_stage, website, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-stone-900">Companies</h1>

      <details className="disclosure card">
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

      <CompaniesTable companies={companies ?? []} />
    </div>
  );
}
