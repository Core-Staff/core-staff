"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserCheck, Filter } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { listEmployees } from "@/lib/db/employees";

export function AttendanceHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [query, setQuery] = useState<string>(searchParams.get("q") ?? "");
  const [dept, setDept] = useState<string>(searchParams.get("dept") ?? "");
  const [status, setStatus] = useState<string>(
    searchParams.get("status") ?? "",
  );
  const [clockOpen, setClockOpen] = useState(false);
  const [employees, setEmployees] = useState<
    { id: string; name: string; department: string }[]
  >([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    setDept(searchParams.get("dept") ?? "");
    setStatus(searchParams.get("status") ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      const list = await listEmployees();
      setEmployees(
        list.map((e) => ({ id: e.id, name: e.name, department: e.department })),
      );
    })();
  }, []);

  const updateUrl = (next: { q?: string; dept?: string; status?: string }) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (next.q !== undefined) {
      if (next.q) sp.set("q", next.q);
      else sp.delete("q");
    }
    if (next.dept !== undefined) {
      if (next.dept) sp.set("dept", next.dept);
      else sp.delete("dept");
    }
    if (next.status !== undefined) {
      if (next.status) sp.set("status", next.status);
      else sp.delete("status");
    }
    router.replace(`${pathname}?${sp.toString()}`);
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    updateUrl({ q: v });
  };

  const onDeptChange = (v: string) => {
    setDept(v);
    updateUrl({ dept: v });
  };

  const onStatusChange = (v: string) => {
    setStatus(v);
    updateUrl({ status: v });
  };

  const validateClockIn = () => {
    const next: Record<string, string> = {};
    if (!selectedEmployeeId) next.employee = "Employee is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onClockInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!validateClockIn()) return;
      const selected = employees.find((x) => x.id === selectedEmployeeId)!;
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: selected.id,
          employeeName: selected.name,
          department: selected.department,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error("clock_in_failed");
      setClockOpen(false);
      setSelectedEmployeeId("");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground">
          Clock users in/out and monitor attendance
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="w-[250px] pl-10"
            value={query}
            onChange={onSearchChange}
          />
        </div>

        <Select value={dept} onValueChange={onDeptChange}>
          <SelectTrigger className="w-[150px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={clockOpen} onOpenChange={setClockOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserCheck className="mr-2 h-4 w-4" />
              Clock In
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Clock In</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={onClockInSubmit}>
              <div className="space-y-2">
                <Label htmlFor="clock-employee">Employee</Label>
                <Select
                  value={selectedEmployeeId}
                  onValueChange={setSelectedEmployeeId}
                >
                  <SelectTrigger aria-label="Select employee">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name} — {e.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.employee && (
                  <div className="text-red-600 text-xs">{errors.employee}</div>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setClockOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Processing..." : "Confirm"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
