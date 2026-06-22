export type LifecycleStage = "lead" | "customer" | "churned";
export type DealStatus = "open" | "won" | "lost";
export type SubscriptionStatus = "active" | "cancelled" | "paused";
export type ActivityType = "note" | "call" | "email" | "demo";
export type TaskStatus = "open" | "done";

export interface Company {
  id: string;
  name: string;
  type: string | null;
  website: string | null;
  address: string | null;
  lifecycle_stage: LifecycleStage;
  source: string | null;
  created_at: string;
}

export interface Contact {
  id: string;
  company_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  is_primary: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
}

export interface PipelineStage {
  id: string;
  name: string;
  sort_order: number;
}

export interface Deal {
  id: string;
  company_id: string;
  contact_id: string | null;
  product_id: string | null;
  stage_id: string;
  value: number | null;
  expected_close_date: string | null;
  status: DealStatus;
  created_at: string;
  closed_at: string | null;
}

export interface Subscription {
  id: string;
  company_id: string;
  product_id: string;
  start_date: string;
  renewal_date: string | null;
  status: SubscriptionStatus;
  price: number | null;
  created_at: string;
}

export interface Activity {
  id: string;
  company_id: string;
  deal_id: string | null;
  type: ActivityType;
  body: string;
  created_by: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  company_id: string;
  deal_id: string | null;
  title: string;
  due_date: string | null;
  status: TaskStatus;
  created_at: string;
  completed_at: string | null;
}
