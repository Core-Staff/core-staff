import { supabase } from "@/lib/data/supabase";
import type { Employee } from "@/types/employee";

type DbEmployee = {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: "active" | "inactive" | "pending";
  avatar?: string | null;
  join_date: string;
  phone?: string | null;
  location?: string | null;
};

const toEmployee = (row: DbEmployee): Employee => ({
  id: row.id,
  name: row.name,
  email: row.email,
  department: row.department,
  position: row.position,
  status: row.status,
  avatar: row.avatar ?? undefined,
  joinDate: row.join_date,
  phone: row.phone ?? undefined,
  location: row.location ?? undefined,
});

const required = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

export async function listEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("join_date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as DbEmployee[]).map(toEmployee);
}

export type CreateEmployeeInput = {
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  department: string;
  position: string;
  status?: "active" | "inactive" | "pending";
  avatar?: string;
  phone?: string;
  location?: string;
  joinDate?: string;
};

export async function createEmployee(
  input: CreateEmployeeInput,
): Promise<Employee> {
  const name =
    input.name ?? [input.firstName, input.lastName].filter(Boolean).join(" ");
  const joinDate = input.joinDate ?? new Date().toISOString();
  const status = input.status ?? "pending";
  if (
    !required(name) ||
    !required(input.email) ||
    !required(input.department) ||
    !required(input.position)
  ) {
    throw new Error("invalid_payload");
  }
  const row = {
    name,
    email: input.email,
    department: input.department,
    position: input.position,
    status,
    avatar: input.avatar ?? null,
    phone: input.phone ?? null,
    location: input.location ?? null,
    join_date: joinDate,
  };
  const { data, error } = await supabase
    .from("employees")
    .insert([row])
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return toEmployee(data as DbEmployee);
}

export type UpdateEmployeeInput = Partial<Omit<Employee, "id" | "joinDate">> & {
  joinDate?: string;
};

export async function updateEmployee(
  id: string,
  input: UpdateEmployeeInput,
): Promise<Employee> {
  if (!required(id)) throw new Error("invalid_id");
  const payload: Partial<DbEmployee> = {};
  if (input.name !== undefined) payload.name = input.name as string;
  if (input.email !== undefined) payload.email = input.email as string;
  if (input.department !== undefined)
    payload.department = input.department as string;
  if (input.position !== undefined) payload.position = input.position as string;
  if (input.status !== undefined)
    payload.status = input.status as DbEmployee["status"];
  if (input.avatar !== undefined) payload.avatar = input.avatar ?? null;
  if (input.phone !== undefined) payload.phone = input.phone ?? null;
  if (input.location !== undefined) payload.location = input.location ?? null;
  if (input.joinDate !== undefined)
    payload.join_date = input.joinDate as string;
  const { data, error } = await supabase
    .from("employees")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return toEmployee(data as DbEmployee);
}

export async function deleteEmployee(id: string): Promise<{ id: string }> {
  if (!required(id)) throw new Error("invalid_id");
  const { error } = await supabase.from("employees").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { id };
}
