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

interface AttendanceListProps {
  logs: AttendanceLog[];
}

export function AttendanceList({ logs }: AttendanceListProps) {
  const router = useRouter();

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

  const onClockOut = async (id: string) => {
    const res = await fetch(`/api/attendance/${id}`, {
      method: "PUT",
    });
    await res.json();
    router.refresh();
  };

  const statusVariant = (s: string) => (s === "open" ? "default" : "secondary");

  return (
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
                  {log.status === "open" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onClockOut(log.id)}
                    >
                      Clock Out
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
