import type { PerformanceReview, Goal } from "@/types/performance";

const API_BASE = "/api/performance";

// Type for API responses
type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

// Reviews API
export const reviewsApi = {
  // Get all reviews with optional filters
  getAll: async (filters?: {
    status?: string;
    employeeId?: string;
    period?: string;
  }): Promise<ApiResponse<PerformanceReview[]>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.employeeId) params.append("employeeId", filters.employeeId);
    if (filters?.period) params.append("period", filters.period);

    const response = await fetch(`${API_BASE}/reviews?${params}`);
    return response.json();
  },

  // Get single review by ID
  getById: async (id: string): Promise<ApiResponse<PerformanceReview>> => {
    const response = await fetch(`${API_BASE}/reviews/${id}`);
    return response.json();
  },

  // Create new review
  create: async (
    review: Omit<PerformanceReview, "id">,
  ): Promise<ApiResponse<PerformanceReview>> => {
    const response = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });
    return response.json();
  },

  // Update review
  update: async (
    id: string,
    updates: Partial<PerformanceReview>,
  ): Promise<ApiResponse<PerformanceReview>> => {
    const response = await fetch(`${API_BASE}/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  // Delete review
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await fetch(`${API_BASE}/reviews/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};

// Goals API
export const goalsApi = {
  // Get all goals with optional filters
  getAll: async (filters?: {
    status?: string;
    employeeId?: string;
  }): Promise<ApiResponse<Goal[]>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.employeeId) params.append("employeeId", filters.employeeId);

    const response = await fetch(`${API_BASE}/goals?${params}`);
    return response.json();
  },

  // Get single goal by ID
  getById: async (id: string): Promise<ApiResponse<Goal>> => {
    const response = await fetch(`${API_BASE}/goals/${id}`);
    return response.json();
  },

  // Create new goal
  create: async (goal: Omit<Goal, "id">): Promise<ApiResponse<Goal>> => {
    const response = await fetch(`${API_BASE}/goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goal),
    });
    return response.json();
  },

  // Update goal
  update: async (
    id: string,
    updates: Partial<Goal>,
  ): Promise<ApiResponse<Goal>> => {
    const response = await fetch(`${API_BASE}/goals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  // Delete goal
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await fetch(`${API_BASE}/goals/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};

// Stats API
export const statsApi = {
  // Get performance statistics
  get: async (
    employeeId?: string,
  ): Promise<
    ApiResponse<{
      reviews: {
        total: number;
        completed: number;
        pending: number;
        inProgress: number;
        avgRating: number;
      };
      goals: {
        total: number;
        completed: number;
        inProgress: number;
        notStarted: number;
        avgProgress: number;
        byCategory: Record<string, number>;
      };
      trends: {
        performanceTrend: Array<{
          period: string;
          rating: number;
          date: string;
        }>;
      };
    }>
  > => {
    const params = employeeId
      ? `?employeeId=${encodeURIComponent(employeeId)}`
      : "";
    const response = await fetch(`${API_BASE}/stats${params}`);
    return response.json();
  },
};
