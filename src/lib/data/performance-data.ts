import { PerformanceReview, Goal } from "@/types/performance";

export const performanceReviews: PerformanceReview[] = [
  {
    id: "1",
    employeeId: "E001",
    employeeName: "Sarah Johnson",
    reviewerId: "M001",
    reviewerName: "John Manager",
    period: "Q3 2025",
    status: "completed",
    overallRating: 4.5,
    createdAt: "2025-09-01",
    updatedAt: "2025-09-30",
  },
  {
    id: "2",
    employeeId: "E002",
    employeeName: "Michael Chen",
    reviewerId: "M001",
    reviewerName: "John Manager",
    period: "Q3 2025",
    status: "pending",
    overallRating: 0,
    createdAt: "2025-09-01",
    updatedAt: "2025-09-01",
  },
];

export const goals: Goal[] = [
  {
    id: "1",
    employeeId: "E001",
    title: "Complete project migration",
    description: "Migrate legacy system to new architecture",
    status: "in-progress",
    progress: 65,
    dueDate: "2025-12-31",
    createdAt: "2025-07-01",
  },
  {
    id: "2",
    employeeId: "E001",
    title: "Improve code review participation",
    description: "Review at least 20 pull requests per month",
    status: "completed",
    progress: 100,
    dueDate: "2025-10-31",
    createdAt: "2025-08-01",
  },
];
