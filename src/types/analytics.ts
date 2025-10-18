export type MetricIcon = "users" | "user-check" | "trending-up" | "file-text";

export interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: "increase" | "decrease";
  icon: MetricIcon;
}

export interface DepartmentData {
  name: string;
  employees: number;
  avgAttendance: number;
  avgPerformance: number;
}

export interface AttendanceTrend {
  month: string;
  present: number;
  absent: number;
  late: number;
}

export interface PerformanceDistribution {
  rating: string;
  count: number;
  percentage: number;
}

export interface TopPerformer {
  id: string;
  name: string;
  department: string;
  score: number;
  avatar?: string;
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  type: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
}
