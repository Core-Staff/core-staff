import { DashboardNav } from "@/components/layout/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardNav />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
