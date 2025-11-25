import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials } from "@/lib/db/users";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Verify credentials
    const result = await verifyCredentials(email, password);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error || "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: result.data,
      message: "Sign in successful"
    });

  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
