import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeaveRequest } from "@/types/analytics";
import { Calendar } from "lucide-react";

interface LeaveRequestsTableProps {
  requests: LeaveRequest[];
}

export function LeaveRequestsTable({ requests }: LeaveRequestsTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recent Leave Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-1">
                <p className="font-medium">{request.employeeName}</p>
                <p className="text-sm text-muted-foreground">
                  {request.department} • {request.type}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(request.startDate)} -{" "}
                  {formatDate(request.endDate)}
                </p>
              </div>
              <Badge variant={getStatusVariant(request.status)}>
                {request.status.charAt(0).toUpperCase() +
                  request.status.slice(1)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
