import type { PerformanceReview, Goal } from "@/types/performance";
import { performanceReviews, goals } from "@/lib/data/performance-data";

export class PerformanceReviewService {
  private reviews: PerformanceReview[];

  constructor() {
    this.reviews = performanceReviews;
  }

  // Get all reviews with optional filters
  getAll(filters?: {
    status?: string;
    employeeId?: string;
    period?: string;
  }): PerformanceReview[] {
    let filtered = [...this.reviews];

    if (filters?.status && filters.status !== "all") {
      filtered = filtered.filter((review) => review.status === filters.status);
    }

    if (filters?.employeeId) {
      filtered = filtered.filter(
        (review) => review.employeeId === filters.employeeId
      );
    }

    if (filters?.period) {
      filtered = filtered.filter((review) => review.period === filters.period);
    }

    return filtered;
  }

  // Get single review by ID
  getById(id: string): PerformanceReview | null {
    return this.reviews.find((review) => review.id === id) || null;
  }

  // Create new review
  create(reviewData: Omit<PerformanceReview, "id">): PerformanceReview {
    const newReview: PerformanceReview = {
      id: `review-${Date.now()}`,
      ...reviewData,
    };

    this.reviews.push(newReview);
    return newReview;
  }

  // Update existing review
  update(id: string, updates: Partial<PerformanceReview>): PerformanceReview | null {
    const index = this.reviews.findIndex((review) => review.id === id);

    if (index === -1) {
      return null;
    }

    this.reviews[index] = {
      ...this.reviews[index],
      ...updates,
      id, // Ensure ID doesn't change
    };

    return this.reviews[index];
  }

  // Delete review
  delete(id: string): boolean {
    const index = this.reviews.findIndex((review) => review.id === id);

    if (index === -1) {
      return false;
    }

    this.reviews.splice(index, 1);
    return true;
  }

  // Get reviews count by status
  getCountByStatus(): Record<string, number> {
    return this.reviews.reduce(
      (acc, review) => {
        acc[review.status] = (acc[review.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  // Calculate average rating
  getAverageRating(employeeId?: string): number {
    const filtered = employeeId
      ? this.reviews.filter((r) => r.employeeId === employeeId)
      : this.reviews;

    const completed = filtered.filter(
      (r) => r.status === "completed" && r.overallRating > 0
    );

    if (completed.length === 0) return 0;

    const sum = completed.reduce((acc, r) => acc + r.overallRating, 0);
    return Number((sum / completed.length).toFixed(2));
  }

  // Get performance trend
  getPerformanceTrend(limit: number = 4): Array<{
    period: string;
    rating: number;
    date: string;
  }> {
    return this.reviews
      .filter((r) => r.status === "completed")
      .sort((a, b) => b.reviewDate.localeCompare(a.reviewDate))
      .slice(0, limit)
      .map((r) => ({
        period: r.period,
        rating: r.overallRating,
        date: r.reviewDate,
      }));
  }

  // Validate required fields for creation
  validateCreate(data: any): { valid: boolean; errors: string[] } {
    const requiredFields = [
      "employeeId",
      "employeeName",
      "reviewerId",
      "reviewerName",
      "period",
      "reviewDate",
    ];

    const errors: string[] = [];

    for (const field of requiredFields) {
      if (!data[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export class GoalService {
  private goals: Goal[];

  constructor() {
    this.goals = goals;
  }

  // Get all goals with optional filters
  getAll(filters?: { status?: string; employeeId?: string }): Goal[] {
    let filtered = [...this.goals];

    if (filters?.status && filters.status !== "all") {
      filtered = filtered.filter((goal) => goal.status === filters.status);
    }

    if (filters?.employeeId) {
      filtered = filtered.filter((goal) => goal.employeeId === filters.employeeId);
    }

    return filtered;
  }

  // Get single goal by ID
  getById(id: string): Goal | null {
    return this.goals.find((goal) => goal.id === id) || null;
  }

  // Create new goal
  create(goalData: Omit<Goal, "id">): Goal {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      ...goalData,
    };

    this.goals.push(newGoal);
    return newGoal;
  }

  // Update existing goal
  update(id: string, updates: Partial<Goal>): Goal | null {
    const index = this.goals.findIndex((goal) => goal.id === id);

    if (index === -1) {
      return null;
    }

    this.goals[index] = {
      ...this.goals[index],
      ...updates,
      id, // Ensure ID doesn't change
    };

    return this.goals[index];
  }

  // Delete goal
  delete(id: string): boolean {
    const index = this.goals.findIndex((goal) => goal.id === id);

    if (index === -1) {
      return false;
    }

    this.goals.splice(index, 1);
    return true;
  }

  // Get goals count by status
  getCountByStatus(): Record<string, number> {
    return this.goals.reduce(
      (acc, goal) => {
        acc[goal.status] = (acc[goal.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  // Get goals by category
  getByCategory(): Record<string, number> {
    return this.goals.reduce(
      (acc, goal) => {
        acc[goal.category] = (acc[goal.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  // Calculate average progress
  getAverageProgress(employeeId?: string): number {
    const filtered = employeeId
      ? this.goals.filter((g) => g.employeeId === employeeId)
      : this.goals;

    if (filtered.length === 0) return 0;

    const sum = filtered.reduce((acc, g) => acc + g.progress, 0);
    return Number((sum / filtered.length).toFixed(2));
  }

  // Get overdue goals
  getOverdue(): Goal[] {
    const today = new Date();
    return this.goals.filter((goal) => {
      const deadline = new Date(goal.deadline);
      return goal.status !== "completed" && deadline < today;
    });
  }

  // Validate required fields for creation
  validateCreate(data: any): { valid: boolean; errors: string[] } {
    const requiredFields = ["employeeId", "title", "description", "deadline"];
    const errors: string[] = [];

    for (const field of requiredFields) {
      if (!data[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export class PerformanceStatsService {
  private reviewService: PerformanceReviewService;
  private goalService: GoalService;

  constructor() {
    this.reviewService = new PerformanceReviewService();
    this.goalService = new GoalService();
  }

  // Get comprehensive statistics
  getStats(employeeId?: string) {
    const reviews = employeeId
      ? this.reviewService.getAll({ employeeId })
      : this.reviewService.getAll();

    const goals = employeeId
      ? this.goalService.getAll({ employeeId })
      : this.goalService.getAll();

    const reviewsByStatus = this.reviewService.getCountByStatus();
    const goalsByStatus = this.goalService.getCountByStatus();
    const goalsByCategory = this.goalService.getByCategory();

    return {
      reviews: {
        total: reviews.length,
        completed: reviewsByStatus.completed || 0,
        pending: reviewsByStatus.pending || 0,
        inProgress: reviewsByStatus["in-progress"] || 0,
        avgRating: this.reviewService.getAverageRating(employeeId),
      },
      goals: {
        total: goals.length,
        completed: goalsByStatus.completed || 0,
        inProgress: goalsByStatus["in-progress"] || 0,
        notStarted: goalsByStatus["not-started"] || 0,
        avgProgress: this.goalService.getAverageProgress(employeeId),
        byCategory: goalsByCategory,
      },
      trends: {
        performanceTrend: this.reviewService.getPerformanceTrend(),
      },
    };
  }
}
