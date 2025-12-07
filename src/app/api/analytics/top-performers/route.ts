import { NextResponse } from "next/server";
import { supabase } from "@/lib/data/supabase";

type TopRow = {
  id: string;
  name: string;
  department: string;
  score: number;
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
    const limitParam = searchParams.get("limit");
    const limit = Math.max(1, Math.min(50, Number(limitParam ?? 5) || 5));
    const range = getPeriodRange(days);

    const { data: revData, error: revErr } = await supabase
      .from("performance_reviews")
      .select("employee_id,overall_rating,review_date")
      .gte("review_date", range.start)
      .lte("review_date", range.end);
    if (revErr) throw new Error(revErr.message);
    const reviews =
      (revData as Array<{
        employee_id: string;
        overall_rating: number;
      }> | null) ?? [];
    if (reviews.length === 0) {
      return NextResponse.json({ ok: true, data: [] });
    }

    const ids = Array.from(new Set(reviews.map((r) => r.employee_id))).filter(
      (x) => typeof x === "string" && x.trim().length > 0,
    );
    const { data: empData, error: empErr } = await supabase
      .from("employees")
      .select("id,name,department")
      .in("id", ids);
    if (empErr) throw new Error(empErr.message);
    const employees =
      (empData as Array<{
        id: string;
        name: string;
        department: string;
      }> | null) ?? [];
    const empInfo = new Map<string, { name: string; department: string }>();
    employees.forEach((e) =>
      empInfo.set(e.id, { name: e.name || "", department: e.department || "" }),
    );

    const agg = new Map<string, { sum: number; count: number }>();
    reviews.forEach((r) => {
      const cur = agg.get(r.employee_id) ?? { sum: 0, count: 0 };
      cur.sum += Number(r.overall_rating ?? 0);
      cur.count += 1;
      agg.set(r.employee_id, cur);
    });

    const rows: TopRow[] = [];
    agg.forEach((v, empId) => {
      const info = empInfo.get(empId);
      if (!info || !info.name || info.name.trim().length === 0) return;
      const avgRating = v.count > 0 ? v.sum / v.count : 0;
      const score = Number(avgRating.toFixed(1));
      rows.push({
        id: empId,
        name: info.name,
        department: info.department ?? "",
        score,
      });
    });

    rows.sort((a, b) => b.score - a.score);
    const top = rows.slice(0, limit);
    return NextResponse.json({ ok: true, data: top });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
