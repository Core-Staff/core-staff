import { NextResponse } from "next/server";
import { supabase } from "@/lib/data/supabase";

type DistRow = {
  rating: string;
  count: number;
  percentage: number;
};

function getPeriodDays(periodParam: string | null): number {
  const d = Number(periodParam ?? 30);
  return Math.max(1, Number.isFinite(d) ? d : 30);
}

function getPeriodRange(days: number) {
  const now = new Date();
  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setUTCHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const days = getPeriodDays(searchParams.get("period"));
    const range = getPeriodRange(days);

    const { data, error } = await supabase
      .from("performance_reviews")
      .select("overall_rating,review_date")
      .gte("review_date", range.start)
      .lte("review_date", range.end);
    if (error) throw new Error(error.message);
    const rows = (data as Array<{ overall_rating: number }> | null) ?? [];

    const buckets = [
      { key: "Excellent (90-100)", min: 90, max: 100 },
      { key: "Good (80-89)", min: 80, max: 89.999 },
      { key: "Satisfactory (70-79)", min: 70, max: 79.999 },
      { key: "Needs Improvement (60-69)", min: 60, max: 69.999 },
      { key: "Poor (<60)", min: -Infinity, max: 59.999 },
    ];

    const counts = new Map<string, number>();
    buckets.forEach((b) => counts.set(b.key, 0));

    rows.forEach((r) => {
      const pct = (Number(r.overall_rating ?? 0) / 5) * 100;
      const bucket = buckets.find((b) => pct >= b.min && pct <= b.max);
      const key = bucket?.key ?? "Poor (<60)";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    const total = rows.length || 1;
    const result: DistRow[] = buckets.map((b) => {
      const count = counts.get(b.key) ?? 0;
      const percentage = Number(((count / total) * 100).toFixed(1));
      return { rating: b.key, count, percentage };
    });

    return NextResponse.json({ ok: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
