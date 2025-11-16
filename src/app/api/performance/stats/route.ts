import { NextRequest, NextResponse } from "next/server";
import { PerformanceStatsService } from "@/lib/services/PerformanceService";

const statsService = new PerformanceStatsService();

// GET performance statistics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const employeeId = searchParams.get("employeeId") || undefined;

    const stats = statsService.getStats(employeeId);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch performance statistics",
      },
      { status: 500 }
    );
  }
}
