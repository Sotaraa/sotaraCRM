"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Companies

export async function updateCompany(companyId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("companies")
    .update({
      name: formData.get("name") as string,
      type: (formData.get("type") as string) || null,
      website: (formData.get("website") as string) || null,
      address: (formData.get("address") as string) || null,
      source: (formData.get("source") as string) || null,
    })
    .eq("id", companyId);

  if (error) throw new Error(error.message);
  revalidatePath(`/companies/${companyId}`);
  revalidatePath("/companies");
}

export async function deleteCompany(companyId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("companies").delete().eq("id", companyId);
  if (error) throw new Error(error.message);
  revalidatePath("/companies");
  redirect("/companies");
}

// Contacts

export async function createContactStandalone(formData: FormData) {
  const supabase = await createClient();
  const companyId = formData.get("company_id") as string;

  const { error } = await supabase.from("contacts").insert({
    company_id: companyId,
    name: formData.get("name") as string,
    email: (formData.get("email") as string) || null,
    phone: (formData.get("phone") as string) || null,
    role: (formData.get("role") as string) || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/contacts");
  revalidatePath(`/companies/${companyId}`);
}

export async function updateContact(contactId: string, companyId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("contacts")
    .update({
      name: formData.get("name") as string,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      role: (formData.get("role") as string) || null,
      is_primary: formData.get("is_primary") === "on",
    })
    .eq("id", contactId);

  if (error) throw new Error(error.message);
  revalidatePath(`/companies/${companyId}`);
  revalidatePath("/contacts");
}

export async function deleteContact(contactId: string, companyId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("contacts").delete().eq("id", contactId);
  if (error) throw new Error(error.message);
  revalidatePath(`/companies/${companyId}`);
  revalidatePath("/contacts");
}

// Deals

export async function createDealStandalone(formData: FormData) {
  const supabase = await createClient();
  const companyId = formData.get("company_id") as string;

  const { data: firstStage } = await supabase
    .from("pipeline_stages")
    .select("id")
    .order("sort_order", { ascending: true })
    .limit(1)
    .single();

  const { error } = await supabase.from("deals").insert({
    company_id: companyId,
    product_id: (formData.get("product_id") as string) || null,
    stage_id: firstStage?.id,
    value: formData.get("value") ? Number(formData.get("value")) : null,
    expected_close_date: (formData.get("expected_close_date") as string) || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/pipeline");
  revalidatePath(`/companies/${companyId}`);
}

export async function updateDeal(dealId: string, companyId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("deals")
    .update({
      product_id: (formData.get("product_id") as string) || null,
      value: formData.get("value") ? Number(formData.get("value")) : null,
      expected_close_date: (formData.get("expected_close_date") as string) || null,
    })
    .eq("id", dealId);

  if (error) throw new Error(error.message);
  revalidatePath(`/companies/${companyId}`);
  revalidatePath("/pipeline");
}

export async function deleteDeal(dealId: string, companyId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("deals").delete().eq("id", dealId);
  if (error) throw new Error(error.message);
  revalidatePath(`/companies/${companyId}`);
  revalidatePath("/pipeline");
}

// Subscriptions

export async function updateSubscription(subscriptionId: string, companyId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("subscriptions")
    .update({
      product_id: formData.get("product_id") as string,
      start_date: formData.get("start_date") as string,
      renewal_date: (formData.get("renewal_date") as string) || null,
      price: formData.get("price") ? Number(formData.get("price")) : null,
      status: (formData.get("status") as string) || "active",
    })
    .eq("id", subscriptionId);

  if (error) throw new Error(error.message);
  revalidatePath(`/companies/${companyId}`);
  revalidatePath("/");
}

export async function deleteSubscription(subscriptionId: string, companyId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("subscriptions").delete().eq("id", subscriptionId);
  if (error) throw new Error(error.message);
  revalidatePath(`/companies/${companyId}`);
  revalidatePath("/");
}

// Activities

export async function deleteActivity(activityId: string, companyId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("activities").delete().eq("id", activityId);
  if (error) throw new Error(error.message);
  revalidatePath(`/companies/${companyId}`);
  revalidatePath("/");
}

// Tasks

export async function addTask(companyId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("tasks").insert({
    company_id: companyId,
    title: formData.get("title") as string,
    due_date: (formData.get("due_date") as string) || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/companies/${companyId}`);
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function addTaskStandalone(formData: FormData) {
  const supabase = await createClient();
  const companyId = formData.get("company_id") as string;

  const { error } = await supabase.from("tasks").insert({
    company_id: companyId,
    title: formData.get("title") as string,
    due_date: (formData.get("due_date") as string) || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/tasks");
  revalidatePath(`/companies/${companyId}`);
  revalidatePath("/");
}

export async function toggleTask(taskId: string, companyId: string, done: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tasks")
    .update({ status: done ? "done" : "open", completed_at: done ? new Date().toISOString() : null })
    .eq("id", taskId);

  if (error) throw new Error(error.message);
  revalidatePath(`/companies/${companyId}`);
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function deleteTask(taskId: string, companyId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) throw new Error(error.message);
  revalidatePath(`/companies/${companyId}`);
  revalidatePath("/tasks");
  revalidatePath("/");
}
