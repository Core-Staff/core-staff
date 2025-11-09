export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewerId: string;
  reviewerName: string;
  period: string;
  status: "draft" | "pending" | "completed";
  overallRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  status: "not-started" | "in-progress" | "completed";
  progress: number;
  dueDate: string;
  createdAt: string;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  category: string;
  rating: number;
  maxRating: number;
  comments?: string;
}
