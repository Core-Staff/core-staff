"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { LeaveRequest } from "@/types/leaveRequest";
import { Calendar, MoreHorizontal, Check, X, Edit2, Save, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface LeaveRequestsTableProps {
  requests: LeaveRequest[];
}

export function LeaveRequestsTable({ requests }: LeaveRequestsTableProps) {
  const [localRequests, setLocalRequests] = React.useState<LeaveRequest[]>(
    () => requests ?? []
  );
  const [loadingIds, setLoadingIds] = React.useState<Record<string, boolean>>({});
  const [hideApproved, setHideApproved] = React.useState(false);
  const [hideRejected, setHideRejected] = React.useState(false);
  const [sortAsc, setSortAsc] = React.useState(false);
  const [lastDays, setLastDays] = React.useState<number>(0); // 0 = disabled
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingValues, setEditingValues] = React.useState<
    Partial<Pick<LeaveRequest, "startDate" | "endDate" | "status">>
  >({});

  React.useEffect(() => {
    setLocalRequests(requests ?? []);
  }, [requests]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const toInputDate = (dateString?: string | null) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setLoadingIds((s) => ({ ...s, [id]: true }));
    setLocalRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      const res = await fetch(`/api/leave-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? `Status update failed (${res.status})`);
      }
      const updated: LeaveRequest = await res.json();
      setLocalRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      console.error("Failed to update status:", err);
      setLocalRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "pending" } : r))
      );
    } finally {
      setLoadingIds((s) => {
        const copy = { ...s };
        delete copy[id];
        return copy;
      });
    }
  };

  const startEdit = (r: LeaveRequest) => {
    setEditingId(r.id);
    setEditingValues({
      status: r.status,
      startDate: toInputDate(r.startDate),
      endDate: r.endDate ? toInputDate(r.endDate) : "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValues({});
  };

  const saveEdit = async (id: string) => {
    if (!editingValues) return cancelEdit();
    setLoadingIds((s) => ({ ...s, [id]: true }));
    setLocalRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              startDate: editingValues.startDate ?? r.startDate,
              endDate: editingValues.endDate ?? r.endDate,
              status: editingValues.status ?? r.status,
            }
          : r
      )
    );

    try {
      const payload: Partial<Pick<LeaveRequest, "startDate" | "endDate" | "status">> = {};
      if (editingValues.startDate) payload.startDate = editingValues.startDate;
      if (editingValues.endDate !== undefined) payload.endDate = editingValues.endDate || null;
      if (editingValues.status) payload.status = editingValues.status;
      const res = await fetch(`/api/leave-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? `Update failed (${res.status})`);
      }
      const updated: LeaveRequest = await res.json();
      setLocalRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      console.error("Failed to save edits:", err);
    } finally {
      setLoadingIds((s) => {
        const copy = { ...s };
        delete copy[id];
        return copy;
      });
      cancelEdit();
    }
  };

  const setEditingField = (field: keyof typeof editingValues, value: string) => {
    setEditingValues((s) => ({ ...(s ?? {}), [field]: value }));
  };
  const filteredSorted = React.useMemo(() => {
    const now = new Date();
    let list = [...localRequests];

    if (hideApproved) list = list.filter((r) => r.status !== "approved");
    if (hideRejected) list = list.filter((r) => r.status !== "rejected");

    if (lastDays > 0) {
      const cutoff = new Date(now.getTime() - lastDays * 24 * 60 * 60 * 1000);
      list = list.filter((r) => {
        // use createdAt if available, otherwise fall back to startDate
        const dateToCheck = r.createdAt ?? r.startDate;
        const d = new Date(dateToCheck as string);
        return !Number.isNaN(d.getTime()) && d >= cutoff;
      });
    }

    list.sort((a, b) => {
      const ta = new Date(a.createdAt ?? a.startDate).getTime();
      const tb = new Date(b.createdAt ?? b.startDate).getTime();
      if (Number.isNaN(ta) || Number.isNaN(tb)) return 0;
      return sortAsc ? ta - tb : tb - ta;
    });

    return list;
  }, [localRequests, hideApproved, hideRejected, lastDays, sortAsc]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Leave Requests</h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={hideApproved}
                onCheckedChange={(v) => setHideApproved(!!v)}
              />
              <span className="text-sm">Hide approved</span>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={hideRejected}
                onCheckedChange={(v) => setHideRejected(!!v)}
              />
              <span className="text-sm">Hide rejected</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortAsc((s) => !s)}
              >
                Sort by Created: {sortAsc ? "Oldest" : "Newest"}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm">Last</label>
              <input
                type="number"
                min={0}
                value={lastDays === 0 ? "" : lastDays}
                onChange={(e) => {
                  const v = e.target.value;
                  // allow empty to mean 0 (disabled)
                  if (v === "") {
                    setLastDays(0);
                    return;
                  }
                  const n = parseInt(v, 10);
                  setLastDays(Number.isNaN(n) ? 0 : Math.max(0, n));
                }}
                className="w-16 rounded border px-2 py-1 text-sm"
                aria-label="Last X days"
                placeholder="0"
              />
              <span className="text-sm">days</span>
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredSorted.length} shown
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {filteredSorted.map((request) => {
            const isEditing = editingId === request.id;
            const isLoading = !!loadingIds[request.id];

            return (
              <div
                key={request.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <p className="font-medium">{request.employeeName}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.department}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(request.startDate)} -{" "}
                    {request.endDate ? formatDate(request.endDate) : "End date: unsure"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <>
                      <select
                        value={(editingValues.status ?? request.status) as string}
                        onChange={(e) => setEditingField("status", e.target.value)}
                        disabled={isLoading}
                        className="rounded border px-2 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <Button
                        size="sm"
                        onClick={() => saveEdit(request.id)}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEdit}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Badge variant={getStatusVariant(request.status)}>
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </Badge>

                      {request.status === "pending" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              aria-label="Open actions"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => updateStatus(request.id, "approved")}
                              disabled={isLoading}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Accept
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateStatus(request.id, "rejected")}
                              disabled={isLoading}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Decline
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(request)}
                          className="flex items-center gap-2"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {filteredSorted.length === 0 && (
            <div className="text-sm text-muted-foreground">No leave requests</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}