import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Users, UserCheck, TrendingUp, FileText, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type MetricIcon = "users" | "user-check" | "trending-up" | "file-text";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  changeType: "increase" | "decrease";
  icon: MetricIcon;
}

const iconMap: Record<MetricIcon, LucideIcon> = {
  users: Users,
  "user-check": UserCheck,
  "trending-up": TrendingUp,
  "file-text": FileText,
};

export function MetricCard({ title, value, change, changeType, icon }: MetricCardProps) {
  const Icon = iconMap[icon] ?? Users;
  const isPositive = changeType === "increase";
  const ChangeIcon = isPositive ? ArrowUp : ArrowDown;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          <ChangeIcon
            className={cn(
              "mr-1 h-4 w-4",
              isPositive ? "text-green-500" : "text-red-500",
            )}
          />
          <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {change}%
          </span>
          <span className="ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}
