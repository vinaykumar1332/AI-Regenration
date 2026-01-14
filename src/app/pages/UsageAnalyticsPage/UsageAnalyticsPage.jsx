import { useState } from "react";
import { Card } from "@/app/components/ui/Card/card";
import { Button } from "@/app/components/ui/Button/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Select/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Table/table";
import { Download, Calendar } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const dailyUsageData = [
  { date: "Jan 7", images: 420, videos: 180 },
  { date: "Jan 8", images: 580, videos: 240 },
  { date: "Jan 9", images: 650, videos: 310 },
  { date: "Jan 10", images: 720, videos: 280 },
  { date: "Jan 11", images: 890, videos: 410 },
  { date: "Jan 12", images: 1020, videos: 480 },
  { date: "Jan 13", images: 950, videos: 520 },
];

const userWiseData = [
  { user: "john.doe@company.com", images: 3420, videos: 1280, total: 4700 },
  { user: "jane.smith@company.com", images: 2890, videos: 960, total: 3850 },
  { user: "bob.wilson@company.com", images: 1540, videos: 820, total: 2360 },
  { user: "alice.brown@company.com", images: 980, videos: 450, total: 1430 },
];

export function UsageAnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState("monthly");

  const handleExport = () => {
    toast.success("Usage report exported successfully");
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Usage & Analytics</h1>
          <p className="text-muted-foreground">Track consumption and analyze usage patterns</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Images</p>
          <p className="text-2xl font-semibold">6,230</p>
          <p className="text-xs text-green-600 mt-1">+12.5% vs last month</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Videos</p>
          <p className="text-2xl font-semibold">2,840</p>
          <p className="text-xs text-green-600 mt-1">+18.2% vs last month</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Active Users</p>
          <p className="text-2xl font-semibold">24</p>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Avg per Day</p>
          <p className="text-2xl font-semibold">712</p>
          <p className="text-xs text-muted-foreground mt-1">Generations</p>
        </Card>
      </div>

      {/* Daily Breakdown Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Daily Breakdown</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={dailyUsageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="images"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{ fill: "#4F46E5", r: 5 }}
              name="Images"
            />
            <Line
              type="monotone"
              dataKey="videos"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ fill: "#06b6d4", r: 5 }}
              name="Videos"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* User-Wise Consumption */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">User-Wise Consumption</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userWiseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="user" stroke="#9ca3af" angle={-15} textAnchor="end" height={80} />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="images" fill="#4F46E5" radius={[8, 8, 0, 0]} name="Images" />
            <Bar dataKey="videos" fill="#06b6d4" radius={[8, 8, 0, 0]} name="Videos" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* User Details Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Images</TableHead>
              <TableHead className="text-right">Videos</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">% of Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userWiseData.map((user) => {
              const totalUsage = userWiseData.reduce((sum, u) => sum + u.total, 0);
              const percentage = ((user.total / totalUsage) * 100).toFixed(1);
              
              return (
                <TableRow key={user.user}>
                  <TableCell className="font-medium">{user.user}</TableCell>
                  <TableCell className="text-right">{user.images.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{user.videos.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-semibold">{user.total.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{percentage}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}













