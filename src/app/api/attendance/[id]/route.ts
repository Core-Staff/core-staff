import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { clockOutLog, updateAttendanceLog } from "@/lib/db/attendance";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    let updated;
    try {
      const body = await request.json();
      if (
        body &&
        ("clockIn" in body || "clockOut" in body || "status" in body)
      ) {
        updated = await updateAttendanceLog(id, body);
      } else {
        updated = await clockOutLog(id);
      }
    } catch {
      updated = await clockOutLog(id);
    }
    return NextResponse.json({ ok: true, data: updated });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 },
    );
  }
}
