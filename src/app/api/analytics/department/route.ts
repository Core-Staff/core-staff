import { NextResponse } from "next/server";
import { supabase } from "@/lib/data/supabase";

type DepartmentRow = {
  name: string;
  employees: number;
  avgAttendance: number;
  avgPerformance: number;
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
  return { start: start.toISOString(), end: end.toISOString(), days };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const days = getPeriodDays(searchParams.get("period"));
    const range = getPeriodRange(days);

    const { data: empData, error: empErr } = await supabase
      .from("employees")
      .select("id,department");
    if (empErr) throw new Error(empErr.message);
    const employees =
      (empData as Array<{ id: string; department: string }> | null) ?? [];
    const deptMap = new Map<string, { ids: string[]; count: number }>();
    employees.forEach((e) => {
      const key = e.department || "";
      const cur = deptMap.get(key) ?? { ids: [], count: 0 };
      cur.ids.push(e.id);
      cur.count += 1;
      deptMap.set(key, cur);
    });

    const { data: attData, error: attErr } = await supabase
      .from("attendance_logs")
      .select("employee_id,clock_in")
      .gte("clock_in", range.start)
      .lte("clock_in", range.end);
    if (attErr) throw new Error(attErr.message);
    const attendance =
      (attData as Array<{ employee_id: string; clock_in: string }> | null) ??
      [];
    const attCounts = new Map<string, number>();
    const empToDept = new Map<string, string>();
    employees.forEach((e) => empToDept.set(e.id, e.department || ""));
    attendance.forEach((row) => {
      const dept = empToDept.get(row.employee_id) ?? "";
      attCounts.set(dept, (attCounts.get(dept) ?? 0) + 1);
    });

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
    const perfAgg = new Map<string, { sum: number; count: number }>();
    reviews.forEach((r) => {
      const dept = empToDept.get(r.employee_id) ?? "";
      const cur = perfAgg.get(dept) ?? { sum: 0, count: 0 };
      cur.sum += r.overall_rating ?? 0;
      cur.count += 1;
      perfAgg.set(dept, cur);
    });

    const rows: DepartmentRow[] = [];
    deptMap.forEach((info, dept) => {
      const employeeCount = info.count;
      if (employeeCount === 0) return;
      const att = attCounts.get(dept) ?? 0;
      const attPct = Math.min(
        100,
        Math.max(0, (att / (employeeCount * range.days)) * 100),
      );
      const perf = perfAgg.get(dept);
      const avgRating = perf && perf.count > 0 ? perf.sum / perf.count : 0;
      const perfPct = Math.min(100, Math.max(0, (avgRating / 5) * 100));
      rows.push({
        name: dept || "",
        employees: employeeCount,
        avgAttendance: Number(attPct.toFixed(1)),
        avgPerformance: Number(perfPct.toFixed(1)),
      });
    });

    rows.sort((a, b) => b.employees - a.employees);
    return NextResponse.json({ ok: true, data: rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
