import { NextRequest, NextResponse } from "next/server";
import {
  getPerformanceReview,
  updatePerformanceReview,
  deletePerformanceReview,
} from "@/lib/db/performance-reviews";

// GET single performance review by ID
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const review = await getPerformanceReview(id);
    return NextResponse.json({ ok: true, data: review });
  } catch (e) {
    const msg = (e as Error).message;
    const status = msg === "invalid_id" ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

// PATCH update performance review
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log(`[API] Updating review ${id} with:`, JSON.stringify(body, null, 2));
    
    // Validate rating if provided
    if (body.overallRating !== undefined) {
      const rating = Number(body.overallRating);
      if (rating < 1 || rating > 5) {
        return NextResponse.json(
          { ok: false, error: "Rating must be between 1 and 5" },
          { status: 400 }
        );
      }
    }
    
    const updated = await updatePerformanceReview(id, body);
    console.log(`[API] Successfully updated review ${id}`);
    
    return NextResponse.json({ ok: true, data: updated });
  } catch (e) {
    const msg = (e as Error).message;
    console.error(`[API] Error updating review:`, msg, e);
    const status = msg === "invalid_id" ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

// DELETE performance review
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await deletePerformanceReview(id);
    return NextResponse.json({ ok: true, data: result });
  } catch (e) {
    const msg = (e as Error).message;
    const status = msg === "invalid_id" ? 400 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
