import { NextResponse } from "next/server";
import { deleteEmployee, updateEmployee } from "@/lib/db/employees";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const updated = await updateEmployee(params.id, body);
    return NextResponse.json({ ok: true, data: updated });
  } catch (e) {
    const msg = (e as Error).message;
    const status = msg === "invalid_id" ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  try {
    const result = await deleteEmployee(params.id);
    return NextResponse.json({ ok: true, data: result });
  } catch (e) {
    const msg = (e as Error).message;
    const status = msg === "invalid_id" ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
