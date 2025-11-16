import { NextRequest, NextResponse } from "next/server";
import { GoalService } from "@/lib/services/PerformanceService";

const goalService = new GoalService();

// GET single goal by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const goal = goalService.getById(params.id);

    if (!goal) {
      return NextResponse.json(
        {
          success: false,
          error: "Goal not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: goal,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch goal",
      },
      { status: 500 }
    );
  }
}

// PATCH update goal
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedGoal = goalService.update(params.id, body);

    if (!updatedGoal) {
      return NextResponse.json(
        {
          success: false,
          error: "Goal not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedGoal,
      message: "Goal updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update goal",
      },
      { status: 500 }
    );
  }
}

// DELETE goal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = goalService.delete(params.id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Goal not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete goal",
      },
      { status: 500 }
    );
  }
}
