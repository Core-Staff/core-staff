export default function PerformancePage() {
  return (
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Performance Management</h1>
        <p className="text-muted-foreground">
          Manage employee reviews, goals, and performance metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Reviews</h3>
          <p className="text-sm text-muted-foreground">Coming soon</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Goals</h3>
          <p className="text-sm text-muted-foreground">Coming soon</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Metrics</h3>
          <p className="text-sm text-muted-foreground">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
