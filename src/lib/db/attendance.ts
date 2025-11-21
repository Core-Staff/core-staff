import { supabase } from "@/lib/data/supabase";
import type { AttendanceLog } from "@/types/attendance";

type DbAttendanceLog = {
  id: string;
  employee_id: string;
  employee_name: string;
  department: string;
  clock_in: string;
  clock_out?: string | null;
  status: "open" | "closed";
};

const toAttendanceLog = (row: DbAttendanceLog): AttendanceLog => ({
  id: row.id,
  employeeId: row.employee_id,
  employeeName: row.employee_name,
  department: row.department,
  clockIn: row.clock_in,
  clockOut: row.clock_out ?? undefined,
  status: row.status,
});

export async function listAttendanceLogs(filters?: {
  q?: string;
  dept?: string;
  status?: "open" | "closed";
}): Promise<AttendanceLog[]> {
  let query = supabase
    .from("attendance_logs")
    .select("*")
    .order("clock_in", { ascending: false });
  if (filters?.dept && filters.dept.toLowerCase() !== "all") {
    query = query.eq("department", filters.dept);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.q && filters.q.trim().length > 0) {
    const term = filters.q.trim();
    query = query.or(
      `employee_name.ilike.%${term}%,department.ilike.%${term}%`,
    );
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as DbAttendanceLog[]).map(toAttendanceLog);
}

export async function clockInEmployee(input: {
  employeeId: string;
  employeeName: string;
  department: string;
}): Promise<AttendanceLog> {
  const now = new Date().toISOString();
  const row: Omit<DbAttendanceLog, "id"> = {
    employee_id: input.employeeId,
    employee_name: input.employeeName,
    department: input.department,
    clock_in: now,
    clock_out: null,
    status: "open",
  };
  const { data, error } = await supabase
    .from("attendance_logs")
    .insert([row])
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return toAttendanceLog(data as DbAttendanceLog);
}

export async function clockOutLog(id: string): Promise<AttendanceLog> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("attendance_logs")
    .update({ clock_out: now, status: "closed" })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return toAttendanceLog(data as DbAttendanceLog);
}
