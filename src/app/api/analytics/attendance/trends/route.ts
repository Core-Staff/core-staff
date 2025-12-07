import { NextResponse } from "next/server";
import { supabase } from "@/lib/data/supabase";

type TrendRow = {
  month: string;
  present: number;
  absent: number;
  late: number;
};

function getPeriodDays(periodParam: string | null): number {
  const d = Number(periodParam ?? 30);
  return Math.max(1, Number.isFinite(d) ? d : 30);
}

function startOfDayIso(d: Date): string {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x.toISOString();
}

function endOfDayIso(d: Date): string {
  const x = new Date(d);
  x.setUTCHours(23, 59, 59, 999);
  return x.toISOString();
}

function getWeeksRange(days: number) {
  const now = new Date();
  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setUTCHours(23, 59, 59, 999);
  const weeks: Array<{
    start: string;
    end: string;
    label: string;
    days: number;
  }> = [];
  const cur = new Date(start);
  while (cur <= end) {
    const weekStart = new Date(cur);
    const weekEnd = new Date(cur);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
    if (weekEnd > end) weekEnd.setTime(end.getTime());
    const label = `Week of ${weekStart.toISOString().slice(0, 10)}`;
    const dayCount = Math.ceil(
      (weekEnd.getTime() - weekStart.getTime() + 1) / (24 * 60 * 60 * 1000),
    );
    weeks.push({
      start: startOfDayIso(weekStart),
      end: endOfDayIso(weekEnd),
      label,
      days: dayCount,
    });
    cur.setUTCDate(cur.getUTCDate() + 7);
  }
  return weeks;
}

function getDaysRange(days: number) {
  const now = new Date();
  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setUTCHours(23, 59, 59, 999);
  const blocks: Array<{
    start: string;
    end: string;
    label: string;
    days: number;
  }> = [];
  const cur = new Date(start);
  while (cur <= end) {
    const dStart = new Date(cur);
    const dEnd = new Date(cur);
    const label = dStart.toISOString().slice(0, 10);
    blocks.push({
      start: startOfDayIso(dStart),
      end: endOfDayIso(dEnd),
      label,
      days: 1,
    });
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return blocks;
}

function getMonthsRange(days: number) {
  const now = new Date();
  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setUTCHours(23, 59, 59, 999);
  const blocks: Array<{
    start: string;
    end: string;
    label: string;
    days: number;
  }> = [];
  const names = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const cur = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1),
  );
  while (cur <= end) {
    const monthStart = new Date(cur);
    const nextMonth = new Date(
      Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 1),
    );
    let monthEndDate = new Date(nextMonth);
    monthEndDate.setUTCDate(monthEndDate.getUTCDate() - 1);
    if (monthEndDate > end) monthEndDate = end;
    let effectiveStart = monthStart;
    if (effectiveStart < start) effectiveStart = start;
    const dayCount = Math.ceil(
      (monthEndDate.getTime() - effectiveStart.getTime() + 1) /
        (24 * 60 * 60 * 1000),
    );
    const label = `${names[monthStart.getUTCMonth()]} ${monthStart.getUTCFullYear()}`;
    blocks.push({
      start: startOfDayIso(effectiveStart),
      end: endOfDayIso(monthEndDate),
      label,
      days: dayCount,
    });
    cur.setUTCMonth(cur.getUTCMonth() + 1, 1);
  }
  return blocks;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const days = getPeriodDays(searchParams.get("period"));
    const blocks =
      days <= 7
        ? getDaysRange(days)
        : days >= 365
          ? getMonthsRange(days)
          : getWeeksRange(days);

    const { data: empData, error: empErr } = await supabase
      .from("employees")
      .select("id");
    if (empErr) throw new Error(empErr.message);
    const employees = (empData as Array<{ id: string }> | null) ?? [];
    const employeeCount = employees.length || 1;

    const results: TrendRow[] = [];
    for (const w of blocks) {
      const { data: attData, error: attErr } = await supabase
        .from("attendance_logs")
        .select("employee_id,clock_in")
        .gte("clock_in", w.start)
        .lte("clock_in", w.end);
      if (attErr) throw new Error(attErr.message);
      const logs =
        (attData as Array<{ employee_id: string; clock_in: string }> | null) ??
        [];
      if (logs.length === 0) {
        continue;
      }

      const dayMap = new Map<string, Set<string>>();
      const dayLateMap = new Map<string, Set<string>>();
      logs.forEach((row) => {
        const day = row.clock_in.slice(0, 10);
        const set = dayMap.get(day) ?? new Set<string>();
        set.add(row.employee_id);
        dayMap.set(day, set);
        const hh = Number(row.clock_in.slice(11, 13));
        const mm = Number(row.clock_in.slice(14, 16));
        const isLate = hh > 9 || (hh === 9 && mm > 30);
        if (isLate) {
          const lset = dayLateMap.get(day) ?? new Set<string>();
          lset.add(row.employee_id);
          dayLateMap.set(day, lset);
        }
      });

      let presentDays = 0;
      let lateDays = 0;
      dayMap.forEach((set) => {
        presentDays += set.size;
      });
      dayLateMap.forEach((set) => {
        lateDays += set.size;
      });

      const denom = employeeCount * w.days;
      const presentPctTotal = Math.min(
        100,
        Math.max(0, (presentDays / denom) * 100),
      );
      const latePct = Math.min(100, Math.max(0, (lateDays / denom) * 100));
      const presentOnTimePct = Math.max(0, presentPctTotal - latePct);
      const absentPct = Math.max(0, 100 - presentPctTotal);

      results.push({
        month: w.label,
        present: Number(presentOnTimePct.toFixed(1)),
        absent: Number(absentPct.toFixed(1)),
        late: Number(latePct.toFixed(1)),
      });
    }

    return NextResponse.json({ ok: true, data: results });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
