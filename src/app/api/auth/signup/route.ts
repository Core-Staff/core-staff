import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/db/users";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Password length validation
    if (password.length < 6) {
      return NextResponse.json(
        { ok: false, error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser.ok) {
      return NextResponse.json(
        { ok: false, error: "User already exists" },
        { status: 409 },
      );
    }

    // Create user
    const result = await createUser(email, password);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error || "Failed to create user" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        data: result.data,
        message: "User created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
