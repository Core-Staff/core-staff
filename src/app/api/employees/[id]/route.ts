import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { deleteEmployee, updateEmployee } from "@/lib/db/employees";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();
    const { id } = await context.params;
    const updated = await updateEmployee(id, body);
    return NextResponse.json({ ok: true, data: updated });
  } catch (e) {
    const msg = (e as Error).message;
    const status = msg === "invalid_id" ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const result = await deleteEmployee(id);
    return NextResponse.json({ ok: true, data: result });
  } catch (e) {
    const msg = (e as Error).message;
    const status = msg === "invalid_id" ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
