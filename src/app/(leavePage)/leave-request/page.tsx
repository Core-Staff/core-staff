"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function EmployeeLeaveRequestPage() {
  const [step, setStep] = React.useState<"email" | "form" | "done">("email");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [employee, setEmployee] = React.useState<{
    id: string;
    name?: string;
    department?: string;
  } | null>(null);
  const [startDate, setStartDate] = React.useState<string>(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [endDate, setEndDate] = React.useState<string>("");

  const router = useRouter();

  const lookupEmail = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/leave-requests/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.status === 404) {
        setError("No employee found with that email.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError(payload?.error ?? "Lookup failed");
        setLoading(false);
        return;
      }
      const emp = await res.json();
      setEmployee(emp);

      // animate to form: set step after a short delay so animation is visible
      // (we keep it immediate for snappy UX)
      setStep("form");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const submitRequest = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (!employee) {
      setError("Employee not loaded.");
      return;
    }
    if (!startDate) {
      setError("Start date is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/leave-requests/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          startDate,
          endDate: endDate || null,
        }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError(payload?.error ?? `Submit failed (${res.status})`);
        setLoading(false);
        return;
      }
      setStep("done");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // sizing for animation: narrow card for email, expanded for form/done
  const cardWidth = step === "email" ? 420 : 760; // px
  const cardMinHeight = step === "email" ? 200 : 420; // px

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div
        // animate size with CSS transition; inline styles for precise px widths
        className="transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
        style={{
          width: cardWidth,
          minHeight: cardMinHeight,
        }}
        aria-live="polite"
      >
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Submit Leave Request</h2>
              <Link href="/" className="text-sm underline">
                Home
              </Link>
            </div>
          </CardHeader>

          <CardContent>
            {/* Email step: fade/slide into view when step==='email' */}
            <div
              className={`transition-all duration-400 ${step === "email" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"} `}
            >
              {step === "email" && (
                <form onSubmit={lookupEmail} className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Enter your work email to start a leave request. If your
                    email exists in our system you&apos;ll be able to continue.
                  </p>

                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 w-full rounded border px-2 py-2"
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-destructive">{error}</div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Checking..." : "Continue"}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Form step: fade/slide in when step==='form' */}
            <div
              className={`transition-all duration-400 ${step === "form" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"} `}
            >
              {step === "form" && employee && (
                <form onSubmit={submitRequest} className="space-y-4">
                  <div>
                    <p className="text-sm">
                      Submitting as: <strong>{employee.name ?? email}</strong>
                    </p>
                    {employee.department && (
                      <p className="text-sm text-muted-foreground">
                        Department: {employee.department}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Start date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="mt-1 w-full rounded border px-2 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      End date (optional)
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1 w-full rounded border px-2 py-2"
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-destructive">{error}</div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Submitting..." : "Submit Leave Request"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        // animate back to email step
                        setStep("email");
                        setEmployee(null);
                      }}
                    >
                      Back
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Done step: simple message */}
            <div
              className={`transition-all duration-400 ${step === "done" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"} `}
            >
              {step === "done" && (
                <div className="space-y-4">
                  <p className="text-sm">
                    Your leave request was submitted successfully and is pending
                    approval.
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => router.push("/")}>Done</Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
