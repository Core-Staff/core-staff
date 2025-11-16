import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PerformanceReview } from "@/types/performance";
import { Calendar, User, Star } from "lucide-react";

interface ReviewCardProps {
  review: PerformanceReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "draft":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "draft":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{review.employeeName}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span>Reviewed by {review.reviewerName}</span>
            </div>
          </div>
          <Badge variant={getStatusVariant(review.status)}>
            {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Period:</span>
            <span className="font-medium">{review.period}</span>
          </div>
          {review.status === "completed" && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{review.overallRating.toFixed(1)}/5.0</span>
            </div>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          Updated {new Date(review.updatedAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
