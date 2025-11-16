import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Goal } from "@/types/performance";
import { Calendar, CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "not-started":
        return <Circle className="h-4 w-4 text-gray-400" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "not-started":
        return "bg-gray-300";
      default:
        return "bg-gray-300";
    }
  };

  const isOverdue = new Date(goal.dueDate) < new Date() && goal.status !== "completed";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            {getStatusIcon(goal.status)}
            <div className="space-y-1 flex-1">
              <CardTitle className="text-base leading-tight">{goal.title}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {goal.description}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{goal.progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn("h-full transition-all", getStatusColor(goal.status))}
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Due:</span>
          </div>
          <span className={cn(
            "font-medium",
            isOverdue ? "text-red-600" : ""
          )}>
            {new Date(goal.dueDate).toLocaleDateString()}
            {isOverdue && " (Overdue)"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
