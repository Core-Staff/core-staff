import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DepartmentData } from "@/types/analytics";

interface DepartmentTableProps {
  data: DepartmentData[];
}

export function DepartmentTable({ data }: DepartmentTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Employees</TableHead>
              <TableHead className="text-right">Avg. Attendance</TableHead>
              <TableHead className="text-right">Avg. Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((dept) => (
              <TableRow key={dept.name}>
                <TableCell className="font-medium">{dept.name}</TableCell>
                <TableCell className="text-right">{dept.employees}</TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                    {dept.avgAttendance}%
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
                    {dept.avgPerformance}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
