import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceHeader, ReviewCard, GoalCard, StatCard } from "@/components/performance";
import { performanceReviews, goals } from "@/lib/data/performance-data";
import { FileText, Target, TrendingUp, Users } from "lucide-react";

export default function PerformancePage() {
  const pendingReviews = performanceReviews.filter(r => r.status === "pending").length;
  const activeGoals = goals.filter(g => g.status === "in-progress").length;
  const completedGoals = goals.filter(g => g.status === "completed").length;
  const totalGoals = goals.length;
  const goalCompletionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <PerformanceHeader />

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Reviews"
          value={performanceReviews.length}
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Pending Reviews"
          value={pendingReviews}
          icon={Users}
          iconColor="text-yellow-600"
        />
        <StatCard
          title="Active Goals"
          value={activeGoals}
          icon={Target}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Goal Completion"
          value={`${goalCompletionRate}%`}
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
          iconColor="text-green-600"
        />
      </div>

      {/* Tabs for Reviews and Goals */}
      <Tabs defaultValue="reviews" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reviews">Performance Reviews</TabsTrigger>
          <TabsTrigger value="goals">Goals & Objectives</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {performanceReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
