"use client"

import { DashboardCard } from '@/components/dashboard/common/dashboard-card'
import { Activity, ArrowUpRight, School, Users, Users2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import { ChartTooltip, ChartTooltipContent, ChartContainer } from "@/components/ui/chart"
import { PieChart, Pie, Cell } from 'recharts';


// TO-DO: static data
const userDistributionData = [
  { name: 'Students', value: 450, fill: '#4F46E5' },
  { name: 'Teachers', value: 50, fill: '#10B981' },
  { name: 'Parents', value: 300, fill: '#F59E0B' },
  { name: 'Staff', value: 25, fill: '#6366F1' },
  { name: 'Admins', value: 5, fill: '#D946EF' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-4">
      {/* cards  */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <DashboardCard
          title="Total Users"
          value="830"
          description="+20.1% from last month"
          icon={Users}
        />
        <DashboardCard
          title="Total Schools"
          value="12"
          description="+2 from last year"
          icon={School}
        />
        <DashboardCard
          title="Active Sessions"
          value="+573"
          description="+201 since last hour"
          icon={Activity}
        />
        <DashboardCard
          title="New Registrations"
          value="+45"
          description="+10 today"
          icon={Users2}
        />
      </div>

      {/* second part TO-DO: make dynamic data */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>School-wise Statistics</CardTitle>
              <CardDescription>
                Overview of student and teacher counts per school.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <a href="/admin/schools">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Teachers</TableHead>
                  <TableHead className="text-right">Avg. Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Lycee Andohalo</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      Antananarivo
                    </div>
                  </TableCell>
                  <TableCell>250</TableCell>
                  <TableCell>15</TableCell>
                  <TableCell className="text-right">92%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Lycee Gallieni</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      Antananarivo
                    </div>
                  </TableCell>
                  <TableCell>300</TableCell>
                  <TableCell>20</TableCell>
                  <TableCell className="text-right">89%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Lycee Ampefiloha</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      Antananarivo
                    </div>
                  </TableCell>
                  <TableCell>280</TableCell>
                  <TableCell>15</TableCell>
                  <TableCell className="text-right">95%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                students: {
                  label: "Students",
                  color: "hsl(var(--chart-1))",
                },
                teachers: {
                  label: "Teachers",
                  color: "hsl(var(--chart-2))",
                },
                parents: {
                  label: "Parents",
                  color: "hsl(var(--chart-3))",
                },
                staff: {
                  label: "Staff",
                  color: "hsl(var(--chart-4))",
                },
                admins: {
                  label: "Admins",
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="mx-auto aspect-square h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={userDistributionData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}