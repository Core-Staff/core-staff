import {
  MetricCard,
  DepartmentData,
  AttendanceTrend,
  PerformanceDistribution,
  TopPerformer,
  LeaveRequest,
  RecentActivity,
} from "@/types/analytics";

export const metricsData: MetricCard[] = [
  {
    title: "Total Employees",
    value: 1234,
    change: 12.5,
    changeType: "increase",
    icon: "users",
  },
  {
    title: "Present Today",
    value: 1156,
    change: 3.2,
    changeType: "increase",
    icon: "user-check",
  },
  {
    title: "Average Performance",
    value: "87.5%",
    change: 5.1,
    changeType: "increase",
    icon: "trending-up",
  },
  {
    title: "Pending Reviews",
    value: 47,
    change: 8.3,
    changeType: "decrease",
    icon: "file-text",
  },
];

export const departmentData: DepartmentData[] = [
  {
    name: "Engineering",
    employees: 245,
    avgAttendance: 94.5,
    avgPerformance: 88.2,
  },
  { name: "Sales", employees: 182, avgAttendance: 91.2, avgPerformance: 85.7 },
  {
    name: "Marketing",
    employees: 98,
    avgAttendance: 93.8,
    avgPerformance: 86.4,
  },
  { name: "HR", employees: 45, avgAttendance: 96.1, avgPerformance: 90.1 },
  { name: "Finance", employees: 67, avgAttendance: 95.3, avgPerformance: 89.5 },
  {
    name: "Operations",
    employees: 134,
    avgAttendance: 92.7,
    avgPerformance: 84.9,
  },
];

export const attendanceTrends: AttendanceTrend[] = [
  { month: "Jan", present: 94.2, absent: 3.5, late: 2.3 },
  { month: "Feb", present: 93.8, absent: 3.8, late: 2.4 },
  { month: "Mar", present: 95.1, absent: 2.9, late: 2.0 },
  { month: "Apr", present: 94.7, absent: 3.2, late: 2.1 },
  { month: "May", present: 93.5, absent: 4.1, late: 2.4 },
  { month: "Jun", present: 94.9, absent: 3.0, late: 2.1 },
];

export const performanceDistribution: PerformanceDistribution[] = [
  { rating: "Excellent (90-100)", count: 347, percentage: 28.1 },
  { rating: "Good (80-89)", count: 456, percentage: 37.0 },
  { rating: "Satisfactory (70-79)", count: 312, percentage: 25.3 },
  { rating: "Needs Improvement (60-69)", count: 89, percentage: 7.2 },
  { rating: "Poor (<60)", count: 30, percentage: 2.4 },
];

export const topPerformers: TopPerformer[] = [
  { id: "1", name: "Sarah Johnson", department: "Engineering", score: 98.5 },
  { id: "2", name: "Michael Chen", department: "Sales", score: 97.2 },
  { id: "3", name: "Emily Rodriguez", department: "Marketing", score: 96.8 },
  { id: "4", name: "David Kim", department: "Engineering", score: 96.3 },
  { id: "5", name: "Jessica Williams", department: "HR", score: 95.9 },
];

export const recentLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    employeeName: "John Doe",
    department: "Engineering",
    type: "Sick Leave",
    startDate: "2025-10-15",
    endDate: "2025-10-17",
    status: "pending",
  },
  {
    id: "2",
    employeeName: "Jane Smith",
    department: "Sales",
    type: "Vacation",
    startDate: "2025-10-20",
    endDate: "2025-10-25",
    status: "approved",
  },
  {
    id: "3",
    employeeName: "Robert Brown",
    department: "Marketing",
    type: "Personal Leave",
    startDate: "2025-10-18",
    endDate: "2025-10-19",
    status: "pending",
  },
  {
    id: "4",
    employeeName: "Lisa Anderson",
    department: "Finance",
    type: "Sick Leave",
    startDate: "2025-10-14",
    endDate: "2025-10-14",
    status: "approved",
  },
  {
    id: "5",
    employeeName: "Tom Wilson",
    department: "Operations",
    type: "Vacation",
    startDate: "2025-11-01",
    endDate: "2025-11-05",
    status: "pending",
  },
];

export const recentActivities: RecentActivity[] = [
  {
    id: "1",
    type: "review",
    description: "Performance review completed for Engineering team",
    timestamp: "2 hours ago",
    user: "Admin",
  },
  {
    id: "2",
    type: "attendance",
    description: "25 employees marked late today",
    timestamp: "3 hours ago",
    user: "System",
  },
  {
    id: "3",
    type: "employee",
    description: "New employee onboarded: Alex Martinez",
    timestamp: "5 hours ago",
    user: "HR Manager",
  },
  {
    id: "4",
    type: "leave",
    description: "15 leave requests approved",
    timestamp: "1 day ago",
    user: "HR Manager",
  },
  {
    id: "5",
    type: "report",
    description: "Monthly analytics report generated",
    timestamp: "2 days ago",
    user: "System",
  },
];
