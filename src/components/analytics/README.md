# Analytics Components

A comprehensive set of modular analytics components built with shadcn/ui for the Effeciency HR management platform.

## Components Overview

### 📊 Core Components

#### AnalyticsHeader

Header component with title, description, and controls for filtering and exporting data.

- **Features**: Period selector, export button
- **Location**: `analytics-header.tsx`

#### MetricCard

Displays key performance metrics with change indicators.

- **Props**: title, value, change, changeType, icon
- **Features**: Dynamic icons, color-coded trends, percentage changes
- **Location**: `metric-card.tsx`

#### DepartmentTable

Tabular view of department-level metrics.

- **Props**: data (DepartmentData[])
- **Features**: Employee counts, attendance rates, performance scores
- **Location**: `department-table.tsx`

#### AttendanceTrendChart

Visual representation of attendance patterns over time.

- **Props**: data (AttendanceTrend[])
- **Features**: Stacked bar chart, present/absent/late breakdown
- **Location**: `attendance-trend-chart.tsx`

#### PerformanceChart

Distribution chart for employee performance ratings.

- **Props**: data (PerformanceDistribution[])
- **Features**: Horizontal bar chart, color-coded ratings, percentages
- **Location**: `performance-chart.tsx`

#### TopPerformersList

Ranked list of top-performing employees.

- **Props**: performers (TopPerformer[])
- **Features**: Avatar initials, department badges, score display, medal rankings
- **Location**: `top-performers-list.tsx`

#### LeaveRequestsTable

Display of recent leave requests with status.

- **Props**: requests (LeaveRequest[])
- **Features**: Employee info, date ranges, status badges
- **Location**: `leave-requests-table.tsx`

#### RecentActivities

Timeline of recent system activities.

- **Props**: activities (RecentActivity[])
- **Features**: Color-coded icons, timestamps, user attribution
- **Location**: `recent-activities.tsx`

## Data Structure

All TypeScript types are defined in `/src/types/analytics.ts`:

- `MetricCard` - Metric data structure
- `DepartmentData` - Department statistics
- `AttendanceTrend` - Monthly attendance data
- `PerformanceDistribution` - Rating distribution
- `TopPerformer` - Employee performance data
- `LeaveRequest` - Leave request details
- `RecentActivity` - Activity log entries

## Dummy Data

Sample data is provided in `/src/lib/data/analytics-data.ts` for development and testing.

## Usage

```tsx
import {
  AnalyticsHeader,
  MetricCard,
  DepartmentTable,
  // ... other components
} from "@/components/analytics";

export default function AnalyticsPage() {
  return (
    <div>
      <AnalyticsHeader />
      <MetricCard
        title="Total Employees"
        value={1234}
        change={12.5}
        changeType="increase"
        icon="users"
      />
      {/* ... other components */}
    </div>
  );
}
```

## Styling

All components use:

- **shadcn/ui** for base components
- **Tailwind CSS** for styling
- **Lucide React** for icons
- Responsive design (mobile-first)
- Dark mode support (via shadcn/ui theming)

## Layout Structure

The analytics page (`/reports`) uses a grid-based layout:

1. **Header** - Full width
2. **Metrics** - 4-column grid (responsive)
3. **Main Content** - 2:1 column split (charts left, stats right)
4. **Bottom Section** - 2-column grid (leave requests & activities)
