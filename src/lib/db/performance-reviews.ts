import { supabase } from "@/lib/data/supabase";
import type { PerformanceReview } from "@/types/performance";

// Database schema type (snake_case matching Supabase)
export type DbPerformanceReview = {
  id: string;
  employee_id: string;
  employee_name: string;
  reviewer_id: string;
  reviewer_name: string;
  position?: string | null;
  period?: string | null;
  review_date: string;
  status: string;
  overall_rating: number;
  strengths?: string[] | null;
  areas_for_improvement?: string[] | null;
  goals?: string[] | null;
  comments?: string | null;
  created_at?: string;
  updated_at?: string;
};

// Convert database row to app type (snake_case -> camelCase)
export const toPerformanceReview = (
  row: DbPerformanceReview,
): PerformanceReview => ({
  id: row.id,
  employeeId: row.employee_id,
  employeeName: row.employee_name,
  position: row.position ?? undefined,
  reviewerId: row.reviewer_id,
  reviewerName: row.reviewer_name,
  period: row.period ?? "",
  reviewDate: row.review_date,
  status: row.status as "draft" | "pending" | "in-progress" | "completed",
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
    .select("*")
    .order("review_date", { ascending: false });

  if (filters?.employeeId) {
    query = query.eq("employee_id", filters.employeeId);
  }
  if (filters?.reviewerId) {
    query = query.eq("reviewer_id", filters.reviewerId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  
  return (data as DbPerformanceReview[]).map((row) => toPerformanceReview(row));
}

// Get a single performance review by ID
export async function getPerformanceReview(
  id: string,
): Promise<PerformanceReview> {
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
  reviewerId: string;
  reviewerName: string;
  reviewDate: string;
  overallRating: number;
  position?: string;
  period?: string;
  status?: "draft" | "pending" | "in-progress" | "completed";
  strengths?: string[];
  areasForImprovement?: string[];
  goals?: string[];
  comments?: string;
};

// Create a new performance review
export async function createPerformanceReview(
  input: CreatePerformanceReviewInput,
): Promise<PerformanceReview> {
  console.log("[DB] Creating review with input:", JSON.stringify(input, null, 2));
  
  // Validate required fields
  if (!required(input.employeeId)) {
    console.error("[DB] Invalid employeeId:", input.employeeId);
    throw new Error("invalid_payload");
  }
  if (!required(input.employeeName)) {
    console.error("[DB] Invalid employeeName:", input.employeeName);
    throw new Error("invalid_payload");
  }
  if (!required(input.reviewerId)) {
    console.error("[DB] Invalid reviewerId:", input.reviewerId);
    throw new Error("invalid_payload");
  }
  if (!required(input.reviewerName)) {
    console.error("[DB] Invalid reviewerName:", input.reviewerName);
    throw new Error("invalid_payload");
  }
  if (!required(input.reviewDate)) {
    console.error("[DB] Invalid reviewDate:", input.reviewDate);
    throw new Error("invalid_payload");
  }

  // Validate rating is within bounds
  if (input.overallRating < 1 || input.overallRating > 5) {
    console.error("[DB] Invalid rating:", input.overallRating);
    throw new Error("Rating must be between 1 and 5");
  }

  const row: Partial<DbPerformanceReview> = {
    employee_id: input.employeeId,
    employee_name: input.employeeName,
    reviewer_id: input.reviewerId,
    reviewer_name: input.reviewerName,
    review_date: input.reviewDate,
    overall_rating: input.overallRating,
    position: input.position ?? null,
    period: input.period ?? null,
    status: input.status ?? "completed",
    strengths: input.strengths && input.strengths.length > 0 ? input.strengths : null,
    areas_for_improvement: input.areasForImprovement && input.areasForImprovement.length > 0 ? input.areasForImprovement : null,
    goals: input.goals && input.goals.length > 0 ? input.goals : null,
    comments: input.comments ?? null,
  };

  console.log("[DB] Inserting row:", JSON.stringify(row, null, 2));

  const { data, error } = await supabase
    .from("performance_reviews")
    .insert([row])
    .select("*")
    .single();

  if (error) {
    console.error("[DB] Supabase error:", error);
    throw new Error(error.message);
  }
  
  console.log("[DB] Insert successful, raw data:", JSON.stringify(data, null, 2));
  
  const transformed = toPerformanceReview(data as DbPerformanceReview);
  
  console.log("[DB] Transformed result:", JSON.stringify(transformed, null, 2));
  
  return transformed;
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
  console.log(`[DB] Updating review ${id} with:`, JSON.stringify(input, null, 2));
  
  if (!required(id)) {
    console.error("[DB] Invalid id:", id);
    throw new Error("invalid_id");
  }

  // Validate rating if being updated
  if (input.overallRating !== undefined && (input.overallRating < 1 || input.overallRating > 5)) {
    console.error("[DB] Invalid rating:", input.overallRating);
    throw new Error("Rating must be between 1 and 5");
  }

  const payload: Partial<DbPerformanceReview> = {};

  if (input.employeeId !== undefined) payload.employee_id = input.employeeId;
  if (input.employeeName !== undefined) payload.employee_name = input.employeeName;
  if (input.reviewerId !== undefined) payload.reviewer_id = input.reviewerId;
  if (input.reviewerName !== undefined) payload.reviewer_name = input.reviewerName;
  if (input.position !== undefined) payload.position = input.position ?? null;
  if (input.period !== undefined) payload.period = input.period ?? null;
  if (input.reviewDate !== undefined) payload.review_date = input.reviewDate;
  if (input.status !== undefined) payload.status = input.status;
  if (input.overallRating !== undefined)
    payload.overall_rating = input.overallRating;
  if (input.strengths !== undefined)
    payload.strengths = input.strengths && input.strengths.length > 0 ? input.strengths : null;
  if (input.areasForImprovement !== undefined)
    payload.areas_for_improvement = input.areasForImprovement && input.areasForImprovement.length > 0 ? input.areasForImprovement : null;
  if (input.goals !== undefined) 
    payload.goals = input.goals && input.goals.length > 0 ? input.goals : null;
  if (input.comments !== undefined) payload.comments = input.comments ?? null;
  
  console.log("[DB] Update payload:", JSON.stringify(payload, null, 2));

  const { data, error } = await supabase
    .from("performance_reviews")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("[DB] Update error:", error);
    throw new Error(error.message);
  }
  
  console.log("[DB] Update successful:", JSON.stringify(data, null, 2));
  
  const transformed = toPerformanceReview(data as DbPerformanceReview);
  
  console.log("[DB] Transformed update result:", JSON.stringify(transformed, null, 2));
  
  return transformed;
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
