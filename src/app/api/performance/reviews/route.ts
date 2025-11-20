import { NextRequest, NextResponse } from "next/server";
import {
  listPerformanceReviews,
  createPerformanceReview,
} from "@/lib/db/performance-reviews";

// GET all performance reviews
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as
      | "draft"
      | "pending"
      | "in-progress"
      | "completed"
      | null;
    const employeeId = searchParams.get("employeeId") || undefined;
    const reviewerId = searchParams.get("reviewerId") || undefined;

    const reviews = await listPerformanceReviews({
      status: status ?? undefined,
      employeeId,
      reviewerId,
    });

    return NextResponse.json({
      ok: true,
      data: reviews,
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: (e as Error).message,
      },
      { status: 500 },
    );
  }
}

// POST create new performance review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await createPerformanceReview(body);
    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (e) {
    const msg = (e as Error).message;
    const status = msg === "invalid_payload" ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
