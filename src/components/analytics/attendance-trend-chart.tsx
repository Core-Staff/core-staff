import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceTrend } from "@/types/analytics";
import { BarChart3 } from "lucide-react";

interface AttendanceTrendChartProps {
  data: AttendanceTrend[];
}

export function AttendanceTrendChart({ data }: AttendanceTrendChartProps) {
  if (!data.length) return null;
  const totalHeight = 160;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Attendance Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span>Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span>Late</span>
            </div>
          </div>
          <div className="flex h-[200px] items-end justify-between gap-2">
            {data.map((item) => (
              <div
                key={item.month}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div className="flex w-full flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-green-500"
                    style={{
                      height: `${(item.present / 100) * totalHeight}px`,
                    }}
                    title={`Present: ${item.present}%`}
                  />
                  <div
                    className="w-full bg-red-500"
                    style={{ height: `${(item.absent / 100) * totalHeight}px` }}
                    title={`Absent: ${item.absent}%`}
                  />
                  <div
                    className="w-full rounded-b bg-yellow-500"
                    style={{ height: `${(item.late / 100) * totalHeight}px` }}
                    title={`Late: ${item.late}%`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
