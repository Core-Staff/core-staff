import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createEmployee, listEmployees } from "@/lib/db/employees";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const url = request ? new URL(request.url) : null;
    const q = url ? (url.searchParams.get("q") ?? undefined) : undefined;
    const dept = url ? (url.searchParams.get("dept") ?? undefined) : undefined;
    const status = url
      ? (url.searchParams.get("status") as "active" | "inactive" | null)
      : null;
    const data = await listEmployees({ q, dept, status: status ?? undefined });
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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
