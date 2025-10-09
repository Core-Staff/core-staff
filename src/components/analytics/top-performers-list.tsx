import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TopPerformer } from "@/types/analytics";
import { Trophy } from "lucide-react";

interface TopPerformersListProps {
  performers: TopPerformer[];
}

export function TopPerformersList({ performers }: TopPerformersListProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-500";
      case 1:
        return "text-gray-400";
      case 2:
        return "text-amber-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {performers.map((performer, index) => (
            <div key={performer.id} className="flex items-center gap-4">
              <div className={`flex-shrink-0 ${getMedalColor(index)}`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold">
                  {index + 1}
                </div>
              </div>
              <Avatar>
                <AvatarFallback>{getInitials(performer.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {performer.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {performer.department}
                </p>
              </div>
              <Badge variant="secondary" className="ml-auto font-semibold">
                {performer.score}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
