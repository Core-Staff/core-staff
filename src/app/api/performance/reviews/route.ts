import { NextRequest, NextResponse } from "next/server";
import { PerformanceReviewService } from "@/lib/services/PerformanceService";

const reviewService = new PerformanceReviewService();

// GET all performance reviews
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || undefined;
    const employeeId = searchParams.get("employeeId") || undefined;
    const period = searchParams.get("period") || undefined;

    const reviews = reviewService.getAll({ status, employeeId, period });

    return NextResponse.json({
      success: true,
      data: reviews,
      count: reviews.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch performance reviews",
      },
      { status: 500 }
    );
  }
}

// POST create new performance review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const validation = reviewService.validateCreate(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.errors.join(", "),
        },
        { status: 400 }
      );
    }

    const newReview = reviewService.create({
      employeeId: body.employeeId,
      employeeName: body.employeeName,
      position: body.position || "Employee",
      reviewerId: body.reviewerId,
      reviewerName: body.reviewerName,
      period: body.period,
      reviewDate: body.reviewDate,
      status: body.status || "pending",
      overallRating: body.overallRating || 0,
      metrics: body.metrics || [],
      strengths: body.strengths || [],
      areasForImprovement: body.areasForImprovement || [],
      goals: body.goals || [],
      comments: body.comments || "",
    });

    return NextResponse.json(
      {
        success: true,
        data: newReview,
        message: "Performance review created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create performance review",
      },
      { status: 500 }
    );
  }
}
