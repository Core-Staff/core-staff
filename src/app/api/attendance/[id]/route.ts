import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { clockOutLog } from "@/lib/db/attendance";

export async function PUT(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const updated = await clockOutLog(id);
    return NextResponse.json({ ok: true, data: updated });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 },
    );
  }
}
