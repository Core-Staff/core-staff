"use client";

import * as React from "react";
import { AnalyticsHeader } from "@/components/analytics/analytics-header";
import { MetricCard } from "@/components/analytics/metric-card";
import { DepartmentTable } from "@/components/analytics/department-table";
import { AttendanceTrendChart } from "@/components/analytics/attendance-trend-chart";
import { PerformanceChart } from "@/components/analytics/performance-chart";
import { TopPerformersList } from "@/components/analytics/top-performers-list";

import type { MetricCard as MetricCardData } from "@/types/analytics";
import type { DepartmentData } from "@/types/analytics";
import type {
  PerformanceDistribution,
  AttendanceTrend,
} from "@/types/analytics";
import type { TopPerformer } from "@/types/analytics";

export default function AnalyticsPage() {
  const [period, setPeriod] = React.useState<string>("30");
  const [metrics, setMetrics] = React.useState<MetricCardData[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [departments, setDepartments] = React.useState<DepartmentData[]>([]);
  const [loadingDepts, setLoadingDepts] = React.useState<boolean>(false);
  const [perfDist, setPerfDist] = React.useState<PerformanceDistribution[]>([]);
  const [loadingPerf, setLoadingPerf] = React.useState<boolean>(false);
  const [attendance, setAttendance] = React.useState<AttendanceTrend[]>([]);
  const [loadingAttendance, setLoadingAttendance] =
    React.useState<boolean>(false);
  const [top, setTop] = React.useState<TopPerformer[]>([]);
  const [loadingTop, setLoadingTop] = React.useState<boolean>(false);

  const fetchMetrics = React.useCallback(async (p: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/analytics/kpis?period=${encodeURIComponent(p)}`,
        { cache: "no-store" },
      );
      const json = await res.json();
      if (json?.ok && Array.isArray(json.data)) {
        setMetrics(json.data as MetricCardData[]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMetrics(period);
  }, [period, fetchMetrics]);

  const fetchDepartments = React.useCallback(async (p: string) => {
    setLoadingDepts(true);
    try {
      const res = await fetch(
        `/api/analytics/department?period=${encodeURIComponent(p)}`,
        { cache: "no-store" },
      );
      const json = await res.json();
      if (json?.ok && Array.isArray(json.data)) {
        setDepartments(json.data as DepartmentData[]);
      }
    } finally {
      setLoadingDepts(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDepartments(period);
  }, [period, fetchDepartments]);

  const fetchPerfDist = React.useCallback(async (p: string) => {
    setLoadingPerf(true);
    try {
      const res = await fetch(
        `/api/analytics/performance/distribution?period=${encodeURIComponent(p)}`,
        { cache: "no-store" },
      );
      const json = await res.json();
      if (json?.ok && Array.isArray(json.data)) {
        setPerfDist(json.data as PerformanceDistribution[]);
      }
    } finally {
      setLoadingPerf(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPerfDist(period);
  }, [period, fetchPerfDist]);

  const fetchAttendance = React.useCallback(async (p: string) => {
    setLoadingAttendance(true);
    try {
      const res = await fetch(
        `/api/analytics/attendance/trends?period=${encodeURIComponent(p)}`,
        { cache: "no-store" },
      );
      const json = await res.json();
      if (json?.ok && Array.isArray(json.data)) {
        setAttendance(json.data as AttendanceTrend[]);
      }
    } finally {
      setLoadingAttendance(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAttendance(period);
  }, [period, fetchAttendance]);

  const fetchTop = React.useCallback(async (p: string) => {
    setLoadingTop(true);
    try {
      const res = await fetch(
        `/api/analytics/top-performers?period=${encodeURIComponent(p)}&limit=5`,
        { cache: "no-store" },
      );
      const json = await res.json();
      if (json?.ok && Array.isArray(json.data)) {
        setTop(json.data as TopPerformer[]);
      } else {
        setTop([]);
      }
    } finally {
      setLoadingTop(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTop(period);
  }, [period, fetchTop]);

  return (
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <AnalyticsHeader period={period} onPeriodChange={setPeriod} />

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(loading ? [] : metrics).map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Larger Charts */}
        <div className="space-y-6 lg:col-span-2">
          <DepartmentTable data={loadingDepts ? [] : departments} />
          <AttendanceTrendChart data={loadingAttendance ? [] : attendance} />
        </div>

        {/* Right Column - Performance & Top Performers */}
        <div className="space-y-6">
          <PerformanceChart data={loadingPerf ? [] : perfDist} />
          <TopPerformersList performers={loadingTop ? [] : top} />
        </div>
      </div>
    </div>
  );
}
