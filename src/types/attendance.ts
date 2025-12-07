export interface AttendanceLog {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  clockIn: string;
  clockOut?: string;
  status: "open" | "closed";
}

export interface AttendanceStats {
  openNow: number;
  todayLogs: number;
  avgDurationMinutes: number;
}
