"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createCompany(formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companies")
    .insert({
      name: formData.get("name") as string,
      type: (formData.get("type") as string) || null,
      website: (formData.get("website") as string) || null,
      address: (formData.get("address") as string) || null,
      lifecycle_stage: (formData.get("lifecycle_stage") as string) || "lead",
      source: (formData.get("source") as string) || null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/companies");
  redirect(`/companies/${data.id}`);
}
