import { NextResponse } from "next/server";
import { createEmployee, listEmployees } from "@/lib/db/employees";

export async function GET() {
  try {
    const data = await listEmployees();
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await createEmployee(body);
    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (e) {
    const msg = (e as Error).message;
    const status = msg === "invalid_payload" ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
