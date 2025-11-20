import { supabase } from "@/lib/data/supabase";
import type { PerformanceReview, PerformanceMetric } from "@/types/performance";

// Database schema type (snake_case matching Supabase)
export type DbPerformanceReview = {
  id: string;
  employee_id: string;
  reviewer_id: string;
  review_date: string;
  overall_rating: number;
  position: string;
  strengths?: string[] | null;
  areas_for_improvement?: string[] | null;
  goals?: string[] | null;
  comments?: string | null;
  created_at?: string;
  updated_at?: string;
};

// Convert database row to app type (snake_case -> camelCase)
// Note: employeeName, reviewerName, period, status, metrics need to be joined/computed separately
export const toPerformanceReview = (
  row: DbPerformanceReview,
  employeeName?: string,
  reviewerName?: string,
): PerformanceReview => ({
  id: row.id,
  employeeId: row.employee_id,
  employeeName: employeeName || "Unknown",
  position: row.position,
  reviewerId: row.reviewer_id,
  reviewerName: reviewerName || "Unknown",
  period: "", // Not in DB, needs to be computed or passed
  reviewDate: row.review_date,
  status: "completed", // Not in DB, default to completed
  overallRating: row.overall_rating,
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
  reviewerId?: string;
}): Promise<PerformanceReview[]> {
  let query = supabase
    .from("performance_reviews")
    .select(`
      *,
      employees!employee_id(name)
    `)
    .order("review_date", { ascending: false });

  if (filters?.employeeId) {
    query = query.eq("employee_id", filters.employeeId);
  }
  if (filters?.reviewerId) {
    query = query.eq("reviewer_id", filters.reviewerId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  
  return (data as any[]).map((row) =>
    toPerformanceReview(
      row as DbPerformanceReview,
      row.employees?.name,
      undefined // reviewerName would need another join
    )
  );
}

// Get a single performance review by ID
export async function getPerformanceReview(
  id: string,
): Promise<PerformanceReview> {
  if (!required(id)) throw new Error("invalid_id");

  const { data, error } = await supabase
    .from("performance_reviews")
    .select(`
      *,
      employees!employee_id(name)
    `)
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  const row = data as any;
  return toPerformanceReview(
    row as DbPerformanceReview,
    row.employees?.name,
    undefined
  );
}

// Create input type
export type CreatePerformanceReviewInput = {
  employeeId: string;
  reviewerId: string;
  reviewDate: string;
  overallRating: number;
  position: string;
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
    !required(input.reviewerId) ||
    !required(input.reviewDate) ||
    !required(input.position)
  ) {
    throw new Error("invalid_payload");
  }

  const row: Partial<DbPerformanceReview> = {
    employee_id: input.employeeId,
    reviewer_id: input.reviewerId,
    review_date: input.reviewDate,
    overall_rating: input.overallRating,
    position: input.position,
    strengths: input.strengths ?? null,
    areas_for_improvement: input.areasForImprovement ?? null,
    goals: input.goals ?? null,
    comments: input.comments ?? null,
  };

  const { data, error } = await supabase
    .from("performance_reviews")
    .insert([row])
    .select(`
      *,
      employees!employee_id(name)
    `)
    .single();

  if (error) throw new Error(error.message);
  const result = data as any;
  return toPerformanceReview(
    result as DbPerformanceReview,
    result.employees?.name,
    undefined
  );
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
  if (input.position !== undefined) payload.position = input.position;
  if (input.reviewerId !== undefined) payload.reviewer_id = input.reviewerId;
  if (input.reviewDate !== undefined) payload.review_date = input.reviewDate;
  if (input.overallRating !== undefined)
    payload.overall_rating = input.overallRating;
  if (input.strengths !== undefined)
    payload.strengths = input.strengths ?? null;
  if (input.areasForImprovement !== undefined)
    payload.areas_for_improvement = input.areasForImprovement ?? null;
  if (input.goals !== undefined) payload.goals = input.goals ?? null;
  if (input.comments !== undefined) payload.comments = input.comments ?? null;

  const { data, error } = await supabase
    .from("performance_reviews")
    .update(payload)
    .eq("id", id)
    .select(`
      *,
      employees!employee_id(name)
    `)
    .single();

  if (error) throw new Error(error.message);
  const result = data as any;
  return toPerformanceReview(
    result as DbPerformanceReview,
    result.employees?.name,
    undefined
  );
}

// Delete a performance review
export async function deletePerformanceReview(
  id: string,
): Promise<{ id: string }> {
  if (!required(id)) throw new Error("invalid_id");

  const { error } = await supabase
    .from("performance_reviews")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return { id };
}
