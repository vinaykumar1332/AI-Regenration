import { StatsCard } from "@/app/components/StatsCard/StatsCard";
import { Card } from "@/app/components/ui/Card/card";
import { Progress } from "@/app/components/ui/Progress/progress";
import { Image, Video, AlertCircle, Activity } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import mockData from "./mockData.json";

const { dailyData, usageData, statusData } = mockData;

export function DashboardPage() {
  const monthlyUsage = 9260;
  const monthlyLimit = 15000;
  const usagePercentage = (monthlyUsage / monthlyLimit) * 100;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your AI generation activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Images Generated Today"
          value="950"
          change="+12.5% from yesterday"
          changeType="positive"
          icon={Image}
          iconColor="text-primary"
        />
        <StatsCard
          title="Videos Generated Today"
          value="520"
          change="+18.2% from yesterday"
          changeType="positive"
          icon={Video}
          iconColor="text-accent"
        />
        <StatsCard
          title="Failed Jobs"
          value="12"
          change="3 in last hour"
          changeType="negative"
          icon={AlertCircle}
          iconColor="text-red-600"
        />
        <StatsCard
          title="Active Jobs"
          value="28"
          change="Processing"
          changeType="neutral"
          icon={Activity}
          iconColor="text-green-600"
        />
      </div>

      {/* Usage Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Monthly Usage</h3>
            <p className="text-sm text-muted-foreground">
              {monthlyUsage.toLocaleString()} / {monthlyLimit.toLocaleString()} generations
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold">{usagePercentage.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">of limit</p>
          </div>
        </div>
        <Progress value={usagePercentage} className="h-3" />
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Generations Line Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Daily Generations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
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
                dot={{ fill: "#4F46E5", r: 4 }}
                name="Images"
              />
              <Line
                type="monotone"
                dataKey="videos"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: "#06b6d4", r: 4 }}
                name="Videos"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Usage Type Bar Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Image vs Video Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {usageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Success vs Failed Donut Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Success vs Failed Jobs</h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}













