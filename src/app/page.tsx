import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to Core Staff</h1>
        <p className="mb-8 text-muted-foreground">
          A modern HR management platform
        </p>
        <Link
          href="/reports"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          View Analytics Dashboard
        </Link>
      </main>
    </div>
  );
}
