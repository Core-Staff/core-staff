"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AttendanceLog } from "@/types/attendance";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AttendanceListProps {
  logs: AttendanceLog[];
}

export function validateEditAttendanceInput(input: {
  clockInLocal: string;
  clockOutLocal: string;
}): Record<string, string> {
  const next: Record<string, string> = {};
  const inLocal = input.clockInLocal?.trim() ?? "";
  const outLocal = input.clockOutLocal?.trim() ?? "";
  if (!outLocal) return next;
  const inDay = inLocal.split("T")[0];
  const outDay = outLocal.split("T")[0];
  if (inDay && outDay && inDay !== outDay) {
    next.clockOut = "Clock out must be same day as clock in";
    return next;
  }
  const inMs = inLocal ? new Date(inLocal).getTime() : NaN;
  const outMs = outLocal ? new Date(outLocal).getTime() : NaN;
  if (!Number.isNaN(inMs) && !Number.isNaN(outMs) && outMs <= inMs) {
    next.clockOut = "Clock out must be after clock in";
    return next;
  }
  return next;
}

export function AttendanceList({ logs }: AttendanceListProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<AttendanceLog | null>(null);
  const [clockInEdit, setClockInEdit] = useState<string>("");
  const [clockOutEdit, setClockOutEdit] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string>("");

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const durationMinutes = (inStr: string, outStr?: string) => {
    if (!outStr) return "";
    const start = new Date(inStr).getTime();
    const end = new Date(outStr).getTime();
    const mins = Math.max(0, Math.round((end - start) / 60000));
    return `${mins}m`;
  };

  const toLocalInputValue = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  const fromLocalInputValue = (local?: string) => {
    if (!local || local.trim() === "") return undefined;
    return new Date(local).toISOString();
  };

  const openEdit = (log: AttendanceLog) => {
    setEditing(log);
    setClockInEdit(toLocalInputValue(log.clockIn));
    setClockOutEdit(toLocalInputValue(log.clockOut));
    setEditError("");
    setEditOpen(true);
  };

  const onSaveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    setEditError("");
    try {
      const errs = validateEditAttendanceInput({
        clockInLocal: clockInEdit,
        clockOutLocal: clockOutEdit,
      });
      if (Object.keys(errs).length > 0) {
        setEditError(errs.clockOut ?? "Invalid values");
        return;
      }
      const inIso = fromLocalInputValue(clockInEdit);
      const outIso = fromLocalInputValue(clockOutEdit);
      const body: Record<string, string | null> = {};
      if (inIso) body.clockIn = inIso;
      if (clockOutEdit.trim() !== "") body.clockOut = outIso ?? null;
      const res = await fetch(`/api/attendance/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.ok) {
        setEditError("Failed to save changes");
        return;
      }
      setEditOpen(false);
      setEditing(null);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const onClockOut = async (id: string) => {
    const res = await fetch(`/api/attendance/${id}`, {
      method: "PUT",
    });
    await res.json();
    router.refresh();
  };

  const statusVariant = (s: string) => (s === "open" ? "default" : "secondary");

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Attendance Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-6"
                  >
                    No attendance logs found
                  </TableCell>
                </TableRow>
              )}
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.employeeName}</TableCell>
                  <TableCell>{log.department}</TableCell>
                  <TableCell>{formatDateTime(log.clockIn)}</TableCell>
                  <TableCell>{formatDateTime(log.clockOut)}</TableCell>
                  <TableCell>
                    {durationMinutes(log.clockIn, log.clockOut)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(log.status)}>
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(log)}
                      >
                        Edit
                      </Button>
                      {log.status === "open" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onClockOut(log.id)}
                        >
                          Clock Out
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Attendance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Clock In</Label>
              <Input
                type="datetime-local"
                value={clockInEdit}
                onChange={(e) => setClockInEdit(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Clock Out</Label>
              <Input
                type="datetime-local"
                value={clockOutEdit}
                onChange={(e) => setClockOutEdit(e.target.value)}
              />
            </div>
            {editError && (
              <div className="text-red-600 text-xs">{editError}</div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSaveEdit} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
