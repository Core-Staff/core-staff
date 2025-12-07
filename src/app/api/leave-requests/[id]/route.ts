import { NextRequest, NextResponse } from "next/server";
import { updateLeaveRequest } from "@/lib/data/leave-requests";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const body = await req.json();
    if (!body || !body.status) {
      return NextResponse.json({ error: "missing_status" }, { status: 400 });
    }
    const updated = await updateLeaveRequest(id, { status: body.status });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error("Failed to update leave request:", err);
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
