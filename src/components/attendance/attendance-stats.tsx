import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AttendanceStats } from "@/types/attendance";

interface AttendanceStatsProps {
  stats: AttendanceStats;
}

export function AttendanceStats({ stats }: AttendanceStatsProps) {
  const items = [
    { title: "Open Now", value: stats.openNow },
    { title: "Today Logs", value: stats.todayLogs },
    { title: "Avg Duration (min)", value: stats.avgDurationMinutes },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((s) => (
        <Card key={s.title}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{s.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
