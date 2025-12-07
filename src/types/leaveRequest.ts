export interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  startDate: string;
  endDate?: string | null;
  createdAt?: string | null;
  status: "pending" | "approved" | "rejected";
}