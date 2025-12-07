import { NextResponse } from "next/server";
import { createLeaveRequest } from "@/lib/data/leave-requests";
import { supabase } from "@/lib/data/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body?.email || "").trim();
    const startDate = body?.startDate || null;
    const endDate = body?.endDate ?? null;

    if (!email || !startDate) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    // Find employee by email
    const { data: emp, error: empErr } = await supabase
      .from("employees")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (empErr) {
      return NextResponse.json({ error: empErr.message }, { status: 500 });
    }
    if (!emp) {
      return NextResponse.json(
        { error: "employee_not_found" },
        { status: 404 },
      );
    }

    // Create leave request (status defaults to pending)
    const created = await createLeaveRequest({
      employeeId: emp.id,
      startDate,
      endDate,
      status: "pending",
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
