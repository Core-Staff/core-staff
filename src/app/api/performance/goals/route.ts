import { NextRequest, NextResponse } from "next/server";
import { GoalService } from "@/lib/services/PerformanceService";

const goalService = new GoalService();

// GET all goals
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || undefined;
    const employeeId = searchParams.get("employeeId") || undefined;

    const goals = goalService.getAll({ status, employeeId });

    return NextResponse.json({
      success: true,
      data: goals,
      count: goals.length,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch goals",
      },
      { status: 500 }
    );
  }
}

// POST create new goal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const validation = goalService.validateCreate(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.errors.join(", "),
        },
        { status: 400 }
      );
    }

    const newGoal = goalService.create({
      employeeId: body.employeeId,
      title: body.title,
      description: body.description,
      category: body.category || "professional",
      status: body.status || "not-started",
      progress: body.progress || 0,
      deadline: body.deadline,
      createdAt: new Date().toISOString().split("T")[0],
      milestones: body.milestones || [],
    });

    return NextResponse.json(
      {
        success: true,
        data: newGoal,
        message: "Goal created successfully",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create goal",
      },
      { status: 500 }
    );
  }
}
