export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  position?: string;
  reviewerId: string;
  reviewerName: string;
  period: string;
  reviewDate: string;
  status: "draft" | "pending" | "in-progress" | "completed";
  overallRating: number;
  metrics?: PerformanceMetric[];
  strengths?: string[];
  areasForImprovement?: string[];
  goals?: string[];
  comments?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  category?: string;
  status: "not-started" | "in-progress" | "completed";
  progress: number;
  deadline: string;
  dueDate?: string;
  createdAt: string;
  milestones?: string[];
}

export interface PerformanceMetric {
  id?: string;
  name: string;
  category?: string;
  rating: number;
  weight?: number;
  maxRating?: number;
  comments?: string;
}
