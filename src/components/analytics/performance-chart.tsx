import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceDistribution } from "@/types/analytics";
import { cn } from "@/lib/utils";

interface PerformanceChartProps {
  data: PerformanceDistribution[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  if (!data.length) return null;
  const getBarColor = (index: number) => {
    const colors = [
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-orange-500",
      "bg-red-500",
    ];
    return colors[index] || "bg-gray-500";
  };

  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item.rating} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.rating}</span>
                <span className="text-muted-foreground">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn("h-full transition-all", getBarColor(index))}
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
