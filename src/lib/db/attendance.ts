import { supabase } from "@/lib/data/supabase";
import type { AttendanceLog } from "@/types/attendance";
import type { DbEmployee } from "@/lib/db/employees";

type DbAttendanceLog = {
  id: string;
  employee_id: string;
  clock_in: string;
  clock_out?: string | null;
  status: "open" | "closed";
};

const toAttendanceLogBase = (
  row: DbAttendanceLog,
): Omit<AttendanceLog, "employeeName" | "department"> & {
  employeeName?: string;
  department?: string;
} => ({
  id: row.id,
  employeeId: row.employee_id,
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
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (
    (filters?.dept && filters.dept.toLowerCase() !== "all") ||
    (filters?.q && filters.q.trim().length > 0)
  ) {
    let empQuery = supabase.from("employees").select("id");
    if (filters?.dept && filters.dept.toLowerCase() !== "all") {
      empQuery = empQuery.eq("department", filters.dept);
    }
    if (filters?.q && filters.q.trim().length > 0) {
      const term = filters.q.trim();
      empQuery = empQuery.or(
        `name.ilike.%${term}%,email.ilike.%${term}%,position.ilike.%${term}%,department.ilike.%${term}%`,
      );
    }
    const { data: empData, error: empError } = await empQuery;
    if (empError) throw new Error(empError.message);
    const empIds = (empData ?? []).map((e: { id: string }) => e.id);
    if (empIds.length === 0) return [];
    query = query.in("employee_id", empIds);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  const rows = (data as DbAttendanceLog[]) ?? [];
  if (rows.length === 0) return [];
  const ids = Array.from(new Set(rows.map((r) => r.employee_id)));
  const { data: employeesData, error: employeesError } = await supabase
    .from("employees")
    .select("id,name,department")
    .in("id", ids);
  if (employeesError) throw new Error(employeesError.message);
  const map = new Map<string, Pick<DbEmployee, "id" | "name" | "department">>();
  (employeesData as Pick<DbEmployee, "id" | "name" | "department">[]).forEach(
    (e) => {
      map.set(e.id, e);
    },
  );
  return rows.map((row) => ({
    id: row.id,
    employeeId: row.employee_id,
    employeeName: map.get(row.employee_id)?.name ?? "",
    department: map.get(row.employee_id)?.department ?? "",
    clockIn: row.clock_in,
    clockOut: row.clock_out ?? undefined,
    status: row.status,
  }));
}

export async function clockInEmployee(input: {
  employeeId: string;
}): Promise<AttendanceLog> {
  const nowDate = new Date();
  const yyyy = nowDate.getUTCFullYear();
  const mm = String(nowDate.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(nowDate.getUTCDate()).padStart(2, "0");
  const startOfDay = new Date(
    `${yyyy}-${mm}-${dd}T00:00:00.000Z`,
  ).toISOString();
  const endOfDay = new Date(`${yyyy}-${mm}-${dd}T23:59:59.999Z`).toISOString();
  const { data: existing, error: existingErr } = await supabase
    .from("attendance_logs")
    .select("id")
    .eq("employee_id", input.employeeId)
    .gte("clock_in", startOfDay)
    .lte("clock_in", endOfDay);
  if (existingErr) throw new Error(existingErr.message);
  if ((existing ?? []).length > 0) {
    throw new Error("duplicate_day");
  }
  const now = nowDate.toISOString();
  const row: Omit<DbAttendanceLog, "id"> = {
    employee_id: input.employeeId,
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
  const inserted = data as DbAttendanceLog;
  const { data: emp, error: empErr } = await supabase
    .from("employees")
    .select("id,name,department")
    .eq("id", input.employeeId)
    .single();
  if (empErr) throw new Error(empErr.message);
  const base = toAttendanceLogBase(inserted);
  return {
    ...base,
    employeeName: (emp as Pick<DbEmployee, "name">).name,
    department: (emp as Pick<DbEmployee, "department">).department,
  } as AttendanceLog;
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
  const updated = data as DbAttendanceLog;
  const { data: emp } = await supabase
    .from("employees")
    .select("id,name,department")
    .eq("id", updated.employee_id)
    .single();
  const base = toAttendanceLogBase(updated);
  return {
    ...base,
    employeeName:
      (emp as Pick<DbEmployee, "name"> | null | undefined)?.name ?? "",
    department:
      (emp as Pick<DbEmployee, "department"> | null | undefined)?.department ??
      "",
  } as AttendanceLog;
}

export async function updateAttendanceLog(
  id: string,
  input: {
    clockIn?: string;
    clockOut?: string | null;
    status?: "open" | "closed";
  },
): Promise<AttendanceLog> {
  const { data: current, error: curErr } = await supabase
    .from("attendance_logs")
    .select("*")
    .eq("id", id)
    .single();
  if (curErr) throw new Error(curErr.message);
  const cur = current as DbAttendanceLog;
  const nextIn = input.clockIn ?? cur.clock_in;
  const nextOut = input.clockOut === undefined ? cur.clock_out : input.clockOut;
  if (nextIn && nextOut) {
    const inMs = new Date(nextIn).getTime();
    const outMs = new Date(nextOut).getTime();
    if (outMs < inMs) throw new Error("invalid_timestamps");
  }
  const payload: Partial<DbAttendanceLog> = {};
  if (input.clockIn !== undefined) payload.clock_in = input.clockIn;
  if (input.clockOut !== undefined) payload.clock_out = input.clockOut ?? null;
  if (input.status !== undefined) payload.status = input.status;
  if (payload.clock_out !== undefined && input.status === undefined) {
    payload.status = payload.clock_out ? "closed" : "open";
  }
  const { data, error } = await supabase
    .from("attendance_logs")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  const updated = data as DbAttendanceLog;
  const { data: emp } = await supabase
    .from("employees")
    .select("id,name,department")
    .eq("id", updated.employee_id)
    .single();
  const base = toAttendanceLogBase(updated);
  return {
    ...base,
    employeeName:
      (emp as Pick<DbEmployee, "name"> | null | undefined)?.name ?? "",
    department:
      (emp as Pick<DbEmployee, "department"> | null | undefined)?.department ??
      "",
  } as AttendanceLog;
}
