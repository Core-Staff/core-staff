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
  console.log("[DB] Creating review with input:", JSON.stringify(input, null, 2));
  
  // Validate required fields
  if (!required(input.employeeId)) {
    console.error("[DB] Invalid employeeId:", input.employeeId);
    throw new Error("invalid_payload");
  }
  if (!required(input.reviewerId)) {
    console.error("[DB] Invalid reviewerId:", input.reviewerId);
    throw new Error("invalid_payload");
  }
  if (!required(input.reviewDate)) {
    console.error("[DB] Invalid reviewDate:", input.reviewDate);
    throw new Error("invalid_payload");
  }
  if (!required(input.position)) {
    console.error("[DB] Invalid position:", input.position);
    throw new Error("invalid_payload");
  }

  // Validate rating is within bounds
  if (input.overallRating < 1 || input.overallRating > 5) {
    console.error("[DB] Invalid rating:", input.overallRating);
    throw new Error("Rating must be between 1 and 5");
  }

  const row: Partial<DbPerformanceReview> = {
    employee_id: input.employeeId,
    reviewer_id: input.reviewerId,
    review_date: input.reviewDate,
    overall_rating: input.overallRating,
    position: input.position,
    strengths: input.strengths && input.strengths.length > 0 ? input.strengths : null,
    areas_for_improvement: input.areasForImprovement && input.areasForImprovement.length > 0 ? input.areasForImprovement : null,
    goals: input.goals && input.goals.length > 0 ? input.goals : null,
    comments: input.comments ?? null,
  };

  console.log("[DB] Inserting row:", JSON.stringify(row, null, 2));

  const { data, error } = await supabase
    .from("performance_reviews")
    .insert([row])
    .select(`
      *,
      employees!employee_id(name)
    `)
    .single();

  if (error) {
    console.error("[DB] Supabase error:", error);
    throw new Error(error.message);
  }
  
  console.log("[DB] Insert successful, raw data:", JSON.stringify(data, null, 2));
  
  const result = data as any;
  const transformed = toPerformanceReview(
    result as DbPerformanceReview,
    result.employees?.name,
    undefined
  );
  
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
  if (input.position !== undefined) payload.position = input.position;
  if (input.reviewerId !== undefined) payload.reviewer_id = input.reviewerId;
  if (input.reviewDate !== undefined) payload.review_date = input.reviewDate;
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
    .select(`
      *,
      employees!employee_id(name)
    `)
    .single();

  if (error) {
    console.error("[DB] Update error:", error);
    throw new Error(error.message);
  }
  
  console.log("[DB] Update successful:", JSON.stringify(data, null, 2));
  
  const result = data as any;
  const transformed = toPerformanceReview(
    result as DbPerformanceReview,
    result.employees?.name,
    undefined
  );
  
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
