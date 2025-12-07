import { supabase } from "@/lib/data/supabase";
import type { LeaveRequest } from "@/types/leaveRequest";

type DbLeaveRequest = {
  id: string;
  employeeId: string;
  startDate: string;
  endDate?: string | null;
  status: "pending" | "approved" | "rejected";
  created_at?: string | null;
};

type DbEmployeePartial = {
  id: string;
  name?: string | null;
  department?: string | null;
};

const required = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

export async function listLeaveRequests(filters?: {
  status?: "pending" | "approved" | "rejected";
  dept?: string;
  q?: string;
}): Promise<LeaveRequest[]> {
  // Order by creation time in DB by default (newest first)
  let query = supabase.from("leaveRequests").select("*").order("created_at", {
    ascending: false,
  });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.dept && filters.dept.toLowerCase() !== "all") {
    query = query.eq("department", filters.dept);
  }
  if (filters?.q && filters.q.trim().length > 0) {
    const term = filters.q.trim();
    query = query.ilike("employeeId", `%${term}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const rows = (data as DbLeaveRequest[]) || [];

  const employeeIds = Array.from(
    new Set(rows.map((r) => r.employeeId).filter(Boolean)),
  );
  const employeesMap: Record<string, DbEmployeePartial> = {};

  if (employeeIds.length > 0) {
    const { data: empData, error: empErr } = await supabase
      .from("employees")
      .select("id,name,department")
      .in("id", employeeIds);

    if (empErr) {
      console.warn(
        "Failed to fetch employees for leave requests:",
        empErr.message,
      );
    } else if (empData) {
      for (const e of empData as DbEmployeePartial[]) {
        employeesMap[e.id] = e;
      }
    }
  }

  const requests: LeaveRequest[] = rows.map((row) => {
    const emp = employeesMap[row.employeeId];
    return {
      id: row.id,
      employeeName: emp?.name ?? row.employeeId,
      department: emp?.department ?? "",
      startDate: row.startDate,
      endDate: row.endDate ?? null,
      createdAt: row.created_at ?? null,
      status: row.status,
    };
  });

  return requests;
}

export type CreateLeaveRequestInput = {
  employeeId: string;
  startDate: string;
  endDate?: string | null;
  status?: "pending" | "approved" | "rejected";
};

export async function createLeaveRequest(
  input: CreateLeaveRequestInput,
): Promise<LeaveRequest> {
  if (!required(input.employeeId) || !required(input.startDate)) {
    throw new Error("invalid_payload");
  }

  const row = {
    employeeId: input.employeeId,
    startDate: input.startDate,
    endDate: input.endDate ?? null,
    status: input.status ?? "pending",
  };

  const { data, error } = await supabase
    .from("leaveRequests")
    .insert([row])
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  const created = data as DbLeaveRequest;

  let emp: DbEmployeePartial | undefined;
  if (created.employeeId) {
    const { data: empData } = await supabase
      .from("employees")
      .select("id,name,department")
      .eq("id", created.employeeId)
      .maybeSingle();
    emp = empData as DbEmployeePartial | undefined;
  }

  return {
    id: created.id,
    employeeName: emp?.name ?? created.employeeId,
    department: emp?.department ?? "",
    startDate: created.startDate,
    endDate: created.endDate ?? null,
    createdAt: created.created_at ?? null,
    status: created.status,
  };
}

export type UpdateLeaveRequestInput = Partial<
  Omit<LeaveRequest, "id" | "employeeName" | "department">
> & {
  employeeId?: string;
  startDate?: string;
  endDate?: string | null;
};

export async function updateLeaveRequest(
  id: string,
  input: UpdateLeaveRequestInput,
): Promise<LeaveRequest> {
  if (!required(id)) throw new Error("invalid_id");

  const payload: Partial<DbLeaveRequest> = {};
  if (input.employeeId !== undefined) payload.employeeId = input.employeeId;
  if (input.startDate !== undefined) payload.startDate = input.startDate;
  if (input.endDate !== undefined) payload.endDate = input.endDate;
  if (input.status !== undefined)
    payload.status = input.status as DbLeaveRequest["status"];

  const { data, error } = await supabase
    .from("leaveRequests")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  const updated = data as DbLeaveRequest;

  let emp: DbEmployeePartial | undefined;
  if (updated.employeeId) {
    const { data: empData } = await supabase
      .from("employees")
      .select("id,name,department")
      .eq("id", updated.employeeId)
      .maybeSingle();
    emp = empData as DbEmployeePartial | undefined;
  }

  return {
    id: updated.id,
    employeeName: emp?.name ?? updated.employeeId,
    department: emp?.department ?? "",
    startDate: updated.startDate,
    endDate: updated.endDate ?? null,
    createdAt: updated.created_at ?? null,
    status: updated.status,
  };
}

export async function deleteLeaveRequest(id: string): Promise<{ id: string }> {
  if (!required(id)) throw new Error("invalid_id");
  const { error } = await supabase.from("leaveRequests").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { id };
}
