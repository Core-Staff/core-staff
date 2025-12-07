import { NextRequest, NextResponse } from "next/server";
import {
  listPerformanceReviews,
  createPerformanceReview,
} from "@/lib/db/performance-reviews";

// GET all performance reviews
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const employeeId = searchParams.get("employeeId") || undefined;
    const reviewerId = searchParams.get("reviewerId") || undefined;

    const reviews = await listPerformanceReviews({
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

    // Log received data for debugging
    console.log("[API] Received review data:", JSON.stringify(body, null, 2));

    // Validate required fields
    if (
      !body.employeeId ||
      !body.employeeName ||
      !body.reviewerId ||
      !body.reviewerName ||
      !body.reviewDate
    ) {
      console.error("[API] Missing required fields:", {
        hasEmployeeId: !!body.employeeId,
        hasEmployeeName: !!body.employeeName,
        hasReviewerId: !!body.reviewerId,
        hasReviewerName: !!body.reviewerName,
        hasReviewDate: !!body.reviewDate,
      });
      return NextResponse.json(
        {
          ok: false,
          error:
            "Missing required fields: employeeId, employeeName, reviewerId, reviewerName, reviewDate",
        },
        { status: 400 },
      );
    }

    // Transform form data to match database schema
    const reviewInput = {
      employeeId: body.employeeId,
      employeeName: body.employeeName,
      reviewerId: body.reviewerId,
      reviewerName: body.reviewerName,
      reviewDate: body.reviewDate,
      overallRating: Number(body.overallRating) || 1,
      position: body.position || undefined,
      period: body.period || undefined,
      status: body.status || "completed",
      strengths: body.strengths || [],
      areasForImprovement: body.areasForImprovement || [],
      goals: body.goals || [],
      comments: body.comments || undefined,
    };

    console.log(
      "[API] Transformed data for DB:",
      JSON.stringify(reviewInput, null, 2),
    );

    const created = await createPerformanceReview(reviewInput);

    console.log("[API] Successfully created review:", created.id);

    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (e) {
    const msg = (e as Error).message;
    console.error("[API] Error creating review:", msg, e);
    const status = msg === "invalid_payload" ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
