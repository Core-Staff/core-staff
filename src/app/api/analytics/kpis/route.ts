import { NextResponse } from "next/server";
import { supabase } from "@/lib/data/supabase";

type MetricIcon = "users" | "user-check" | "trending-up" | "file-text";

type Metric = {
  title: string;
  value: string | number;
  change: number;
  changeType: "increase" | "decrease";
  icon: MetricIcon;
};

function getPeriodRanges(periodDays: number) {
  const now = new Date();
  const endCurrent = now;
  const startCurrent = new Date(now);
  startCurrent.setUTCDate(startCurrent.getUTCDate() - (periodDays - 1));
  startCurrent.setUTCHours(0, 0, 0, 0);
  const endCurrentDay = new Date(endCurrent);
  endCurrentDay.setUTCHours(23, 59, 59, 999);

  const endPrev = new Date(startCurrent);
  endPrev.setUTCDate(endPrev.getUTCDate() - 1);
  endPrev.setUTCHours(23, 59, 59, 999);
  const startPrev = new Date(endPrev);
  startPrev.setUTCDate(startPrev.getUTCDate() - (periodDays - 1));
  startPrev.setUTCHours(0, 0, 0, 0);

  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setUTCHours(23, 59, 59, 999);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setUTCDate(yesterdayStart.getUTCDate() - 1);
  const yesterdayEnd = new Date(todayEnd);
  yesterdayEnd.setUTCDate(yesterdayEnd.getUTCDate() - 1);

  return {
    startCurrent: startCurrent.toISOString(),
    endCurrent: endCurrentDay.toISOString(),
    startPrev: startPrev.toISOString(),
    endPrev: endPrev.toISOString(),
    todayStart: todayStart.toISOString(),
    todayEnd: todayEnd.toISOString(),
    yesterdayStart: yesterdayStart.toISOString(),
    yesterdayEnd: yesterdayEnd.toISOString(),
  };
}

function pctChange(
  current: number,
  previous: number,
): { pct: number; type: "increase" | "decrease" } {
  if (previous === 0) {
    return { pct: 0, type: current >= 0 ? "increase" : "decrease" };
  }
  const diff = ((current - previous) / previous) * 100;
  return {
    pct: Number(diff.toFixed(1)),
    type: diff >= 0 ? "increase" : "decrease",
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const periodParam = searchParams.get("period");
    const periodDays = Math.max(1, Number(periodParam ?? 30));
    const ranges = getPeriodRanges(periodDays);

    // Total Employees: count as-of end of each period (by join_date)
    const { count: currentEmpCount, error: empErr1 } = await supabase
      .from("employees")
      .select("id", { count: "exact", head: true })
      .lte("join_date", ranges.endCurrent);
    if (empErr1) throw new Error(empErr1.message);

    const { count: prevEmpCount, error: empErr2 } = await supabase
      .from("employees")
      .select("id", { count: "exact", head: true })
      .lte("join_date", ranges.endPrev);
    if (empErr2) throw new Error(empErr2.message);

    const empChange = pctChange(currentEmpCount ?? 0, prevEmpCount ?? 0);

    // Present Today vs Yesterday: distinct attendance logs per day
    const { count: todayPresent, error: attErr1 } = await supabase
      .from("attendance_logs")
      .select("employee_id", { count: "exact", head: true })
      .gte("clock_in", ranges.todayStart)
      .lte("clock_in", ranges.todayEnd);
    if (attErr1) throw new Error(attErr1.message);

    const { count: yesterdayPresent, error: attErr2 } = await supabase
      .from("attendance_logs")
      .select("employee_id", { count: "exact", head: true })
      .gte("clock_in", ranges.yesterdayStart)
      .lte("clock_in", ranges.yesterdayEnd);
    if (attErr2) throw new Error(attErr2.message);

    const presentChange = pctChange(todayPresent ?? 0, yesterdayPresent ?? 0);

    // Average Performance (0..5) in current period vs previous
    const { data: perfCurData, error: perfErr1 } = await supabase
      .from("performance_reviews")
      .select("overall_rating,review_date")
      .gte("review_date", ranges.startCurrent)
      .lte("review_date", ranges.endCurrent);
    if (perfErr1) throw new Error(perfErr1.message);
    const curRows =
      (perfCurData as Array<{ overall_rating: number }> | null) ?? [];
    const curAvg =
      curRows.reduce((s: number, r) => s + (r.overall_rating ?? 0), 0) /
      Math.max(1, curRows.length);

    const { data: perfPrevData, error: perfErr2 } = await supabase
      .from("performance_reviews")
      .select("overall_rating,review_date")
      .gte("review_date", ranges.startPrev)
      .lte("review_date", ranges.endPrev);
    if (perfErr2) throw new Error(perfErr2.message);
    const prevRows =
      (perfPrevData as Array<{ overall_rating: number }> | null) ?? [];
    const prevAvg =
      prevRows.reduce((s: number, r) => s + (r.overall_rating ?? 0), 0) /
      Math.max(1, prevRows.length);
    const perfChange = pctChange(curAvg, prevAvg);
    const perfPercent = Number(((curAvg / 5) * 100).toFixed(1));

    // Pending Leave Requests this period vs ALL leave requests last period
    const { count: pendingCur, error: leaveErr1 } = await supabase
      .from("leaveRequests")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .gte("created_at", ranges.startCurrent)
      .lte("created_at", ranges.endCurrent);
    if (leaveErr1) throw new Error(leaveErr1.message);

    const { count: allPrev, error: leaveErr2 } = await supabase
      .from("leaveRequests")
      .select("id", { count: "exact", head: true })
      .gte("created_at", ranges.startPrev)
      .lte("created_at", ranges.endPrev);
    if (leaveErr2) throw new Error(leaveErr2.message);

    const leaveChange = pctChange(pendingCur ?? 0, allPrev ?? 0);

    const metrics: Metric[] = [
      {
        title: "Total Employees",
        value: currentEmpCount ?? 0,
        change: empChange.pct,
        changeType: empChange.type,
        icon: "users",
      },
      {
        title: "Present Today",
        value: todayPresent ?? 0,
        change: presentChange.pct,
        changeType: presentChange.type,
        icon: "user-check",
      },
      {
        title: "Average Performance",
        value: `${perfPercent}%`,
        change: perfChange.pct,
        changeType: perfChange.type,
        icon: "trending-up",
      },
      {
        title: "Pending Leave Requests",
        value: pendingCur ?? 0,
        change: leaveChange.pct,
        changeType: leaveChange.type,
        icon: "file-text",
      },
    ];

    return NextResponse.json({ ok: true, data: metrics });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
