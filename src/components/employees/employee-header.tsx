import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus, Filter, Download } from "lucide-react";
import { InviteEmployeeDialog } from "@/components/employees/invite-employee-dialog";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function EmployeeHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [query, setQuery] = useState<string>(searchParams.get("q") ?? "");
  const [dept, setDept] = useState<string>(searchParams.get("dept") ?? "");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    setDept(searchParams.get("dept") ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="operations">Operations</SelectItem>
          </SelectContent>
        </Select>

        {/* Export Button */}
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>

        {/* Invite Employee Button */}
        <InviteEmployeeDialog>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Employee
          </Button>
        </InviteEmployeeDialog>
      </div>
    </div>
  );
}
("use client");
