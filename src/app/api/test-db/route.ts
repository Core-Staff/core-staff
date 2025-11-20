import { NextResponse } from "next/server";
import { supabase } from "@/lib/data/supabase";

export async function GET() {
  try {
    // Test query to see table structure
    const { data, error } = await supabase
      .from("performance_reviews")
      .select("*")
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
          details: error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      data,
      message: "Table exists and is accessible",
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
