import { NextRequest, NextResponse } from "next/server";
import { PerformanceReviewService } from "@/lib/services/PerformanceService";

const reviewService = new PerformanceReviewService();

// GET single performance review by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const review = reviewService.getById(id);

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          error: "Performance review not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch performance review",
      },
      { status: 500 }
    );
  }
}

// PATCH update performance review
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedReview = reviewService.update(id, body);

    if (!updatedReview) {
      return NextResponse.json(
        {
          success: false,
          error: "Performance review not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedReview,
      message: "Performance review updated successfully",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update performance review",
      },
      { status: 500 }
    );
  }
}

// DELETE performance review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = reviewService.delete(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Performance review not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Performance review deleted successfully",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete performance review",
      },
      { status: 500 }
    );
  }
}
