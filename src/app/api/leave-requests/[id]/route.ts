import { NextResponse } from "next/server";
import { updateLeaveRequest } from "@/lib/data/leave-requests";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await req.json();
    if (!body || !body.status) {
      return NextResponse.json({ error: "missing_status" }, { status: 400 });
    }
    const updated = await updateLeaveRequest(id, { status: body.status });
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("Failed to update leave request:", err);
    return NextResponse.json({ error: err?.message ?? "unknown_error" }, { status: 500 });
  }
}