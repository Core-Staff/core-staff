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
import { Search, UserPlus, Filter } from "lucide-react";
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
export function validateAddEmployeeInput(input: {
  name: string;
  email: string;
  department: string;
  position: string;
}): Record<string, string> {
  const next: Record<string, string> = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const department = input.department.trim();
  const position = input.position.trim();
  if (!name) next.name = "Name is required";
  const emailOk = /.+@.+\..+/.test(email);
  if (!emailOk) next.email = "Valid email is required";
  if (!department) next.department = "Department is required";
  if (!position) next.position = "Position is required";
  return next;
}

export function EmployeeHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [query, setQuery] = useState<string>(searchParams.get("q") ?? "");
  const [dept, setDept] = useState<string>(searchParams.get("dept") ?? "");
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState<string>("");
  const [position, setPosition] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    setDept(searchParams.get("dept") ?? "");
  }, [searchParams]);

  const updateUrl = (next: { q?: string; dept?: string }) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (next.q !== undefined) {
      if (next.q) sp.set("q", next.q);
      else sp.delete("q");
    }
    if (next.dept !== undefined) {
      if (next.dept) sp.set("dept", next.dept);
      else sp.delete("dept");
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

  const validateAdd = () => {
    const next = validateAddEmployeeInput({
      name,
      email,
      department,
      position,
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!validateAdd()) return;
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, department, position }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error("create_failed");
      setAddOpen(false);
      setName("");
      setEmail("");
      setDepartment("");
      setPosition("");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Employee Management
        </h1>
        <p className="text-muted-foreground">
          Manage your team members and invite new employees
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="w-[250px] pl-10"
            value={query}
            onChange={onSearchChange}
          />
        </div>

        {/* Department Filter */}
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

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Employee</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={onAddSubmit}>
              <div className="space-y-2">
                <Label htmlFor="add-name">Full Name</Label>
                <Input
                  id="add-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                {errors.name && (
                  <div className="text-red-600 text-xs">{errors.name}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-email">Email</Label>
                <Input
                  id="add-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && (
                  <div className="text-red-600 text-xs">{errors.email}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-dept">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger aria-label="Select department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department && (
                  <div className="text-red-600 text-xs">
                    {errors.department}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-position">Position</Label>
                <Input
                  id="add-position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                />
                {errors.position && (
                  <div className="text-red-600 text-xs">{errors.position}</div>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
