import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentActivity } from "@/types/analytics";
import { Activity, FileText, Users, Calendar, BarChart } from "lucide-react";

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "review":
        return FileText;
      case "attendance":
        return Activity;
      case "employee":
        return Users;
      case "leave":
        return Calendar;
      case "report":
        return BarChart;
      default:
        return Activity;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "review":
        return "text-blue-500 bg-blue-50";
      case "attendance":
        return "text-green-500 bg-green-50";
      case "employee":
        return "text-purple-500 bg-purple-50";
      case "leave":
        return "text-orange-500 bg-orange-50";
      case "report":
        return "text-pink-500 bg-pink-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start gap-4">
                <div
                  className={`rounded-full p-2 ${getIconColor(activity.type)}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.user} • {activity.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
