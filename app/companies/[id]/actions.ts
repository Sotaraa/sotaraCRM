"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addContact(companyId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("contacts").insert({
    company_id: companyId,
    name: formData.get("name") as string,
    email: (formData.get("email") as string) || null,
    phone: (formData.get("phone") as string) || null,
    role: (formData.get("role") as string) || null,
    is_primary: formData.get("is_primary") === "on",
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/companies/${companyId}`);
}

export async function addDeal(companyId: string, formData: FormData) {
  const supabase = await createClient();

  const { data: firstStage } = await supabase
    .from("pipeline_stages")
    .select("id")
    .order("sort_order", { ascending: true })
    .limit(1)
    .single();

  const { error } = await supabase.from("deals").insert({
    company_id: companyId,
    contact_id: (formData.get("contact_id") as string) || null,
    product_id: (formData.get("product_id") as string) || null,
    stage_id: firstStage?.id,
    value: formData.get("value") ? Number(formData.get("value")) : null,
    expected_close_date: (formData.get("expected_close_date") as string) || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/companies/${companyId}`);
  revalidatePath("/pipeline");
}

export async function addSubscription(companyId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("subscriptions").insert({
    company_id: companyId,
    product_id: formData.get("product_id") as string,
    start_date: formData.get("start_date") as string,
    renewal_date: (formData.get("renewal_date") as string) || null,
    price: formData.get("price") ? Number(formData.get("price")) : null,
    status: (formData.get("status") as string) || "active",
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/companies/${companyId}`);
  revalidatePath("/");
}

export async function addActivity(companyId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("activities").insert({
    company_id: companyId,
    type: (formData.get("type") as string) || "note",
    body: formData.get("body") as string,
    created_by: user?.id ?? null,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/companies/${companyId}`);
  revalidatePath("/");
}

export async function updateLifecycleStage(companyId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("companies")
    .update({ lifecycle_stage: formData.get("lifecycle_stage") as string })
    .eq("id", companyId);

  if (error) throw new Error(error.message);
  revalidatePath(`/companies/${companyId}`);
  revalidatePath("/companies");
}
