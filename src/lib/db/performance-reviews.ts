import { supabase } from "@/lib/data/supabase";
import type { PerformanceReview, PerformanceMetric } from "@/types/performance";

// Database schema type (snake_case matching Supabase)
export type DbPerformanceReview = {
  id: string;
  employee_id: string;
  employee_name: string;
  position?: string | null;
  reviewer_id: string;
  reviewer_name: string;
  period: string;
  review_date: string;
  status: "draft" | "pending" | "in-progress" | "completed";
  overall_rating: number;
  metrics?: PerformanceMetric[] | null;
  strengths?: string[] | null;
  areas_for_improvement?: string[] | null;
  goals?: string[] | null;
  comments?: string | null;
  created_at?: string;
  updated_at?: string;
};

// Convert database row to app type (snake_case -> camelCase)
export const toPerformanceReview = (row: DbPerformanceReview): PerformanceReview => ({
  id: row.id,
  employeeId: row.employee_id,
  employeeName: row.employee_name,
  position: row.position ?? undefined,
  reviewerId: row.reviewer_id,
  reviewerName: row.reviewer_name,
  period: row.period,
  reviewDate: row.review_date,
  status: row.status,
  overallRating: row.overall_rating,
  metrics: row.metrics ?? undefined,
  strengths: row.strengths ?? undefined,
  areasForImprovement: row.areas_for_improvement ?? undefined,
  goals: row.goals ?? undefined,
  comments: row.comments ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const required = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

// List all performance reviews with optional filters
export async function listPerformanceReviews(filters?: {
  employeeId?: string;
  status?: "draft" | "pending" | "in-progress" | "completed";
  reviewerId?: string;
}): Promise<PerformanceReview[]> {
  let query = supabase
    .from("performance_reviews")
    .select("*")
    .order("review_date", { ascending: false });

  if (filters?.employeeId) {
    query = query.eq("employee_id", filters.employeeId);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.reviewerId) {
    query = query.eq("reviewer_id", filters.reviewerId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as DbPerformanceReview[]).map(toPerformanceReview);
}

// Get a single performance review by ID
export async function getPerformanceReview(id: string): Promise<PerformanceReview> {
  if (!required(id)) throw new Error("invalid_id");

  const { data, error } = await supabase
    .from("performance_reviews")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return toPerformanceReview(data as DbPerformanceReview);
}

// Create input type
export type CreatePerformanceReviewInput = {
  employeeId: string;
  employeeName: string;
  position?: string;
  reviewerId: string;
  reviewerName: string;
  period: string;
  reviewDate: string;
  status?: "draft" | "pending" | "in-progress" | "completed";
  overallRating: number;
  metrics?: PerformanceMetric[];
  strengths?: string[];
  areasForImprovement?: string[];
  goals?: string[];
  comments?: string;
};

// Create a new performance review
export async function createPerformanceReview(
  input: CreatePerformanceReviewInput,
): Promise<PerformanceReview> {
  if (
    !required(input.employeeId) ||
    !required(input.employeeName) ||
    !required(input.reviewerId) ||
    !required(input.reviewerName) ||
    !required(input.period) ||
    !required(input.reviewDate)
  ) {
    throw new Error("invalid_payload");
  }

  const row: Partial<DbPerformanceReview> = {
    employee_id: input.employeeId,
    employee_name: input.employeeName,
    position: input.position ?? null,
    reviewer_id: input.reviewerId,
    reviewer_name: input.reviewerName,
    period: input.period,
    review_date: input.reviewDate,
    status: input.status ?? "draft",
    overall_rating: input.overallRating,
    metrics: input.metrics ?? null,
    strengths: input.strengths ?? null,
    areas_for_improvement: input.areasForImprovement ?? null,
    goals: input.goals ?? null,
    comments: input.comments ?? null,
  };

  const { data, error } = await supabase
    .from("performance_reviews")
    .insert([row])
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return toPerformanceReview(data as DbPerformanceReview);
}

// Update input type
export type UpdatePerformanceReviewInput = Partial<
  Omit<PerformanceReview, "id" | "createdAt" | "updatedAt">
>;

// Update an existing performance review
export async function updatePerformanceReview(
  id: string,
  input: UpdatePerformanceReviewInput,
): Promise<PerformanceReview> {
  if (!required(id)) throw new Error("invalid_id");

  const payload: Partial<DbPerformanceReview> = {};

  if (input.employeeId !== undefined) payload.employee_id = input.employeeId;
  if (input.employeeName !== undefined) payload.employee_name = input.employeeName;
  if (input.position !== undefined) payload.position = input.position ?? null;
  if (input.reviewerId !== undefined) payload.reviewer_id = input.reviewerId;
  if (input.reviewerName !== undefined) payload.reviewer_name = input.reviewerName;
  if (input.period !== undefined) payload.period = input.period;
  if (input.reviewDate !== undefined) payload.review_date = input.reviewDate;
  if (input.status !== undefined) payload.status = input.status;
  if (input.overallRating !== undefined) payload.overall_rating = input.overallRating;
  if (input.metrics !== undefined) payload.metrics = input.metrics ?? null;
  if (input.strengths !== undefined) payload.strengths = input.strengths ?? null;
  if (input.areasForImprovement !== undefined)
    payload.areas_for_improvement = input.areasForImprovement ?? null;
  if (input.goals !== undefined) payload.goals = input.goals ?? null;
  if (input.comments !== undefined) payload.comments = input.comments ?? null;

  const { data, error } = await supabase
    .from("performance_reviews")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return toPerformanceReview(data as DbPerformanceReview);
}

// Delete a performance review
export async function deletePerformanceReview(id: string): Promise<{ id: string }> {
  if (!required(id)) throw new Error("invalid_id");

  const { error } = await supabase
    .from("performance_reviews")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return { id };
}
