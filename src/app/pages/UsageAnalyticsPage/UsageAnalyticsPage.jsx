import { useState, useEffect } from "react";
import { Card } from "@/app/components/ui/Card/card";
import { Button } from "@/app/components/ui/Button/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Select/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Table/table";
import { Download, Calendar, Loader2 } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { useAppConfig } from "@/appConfig/useAppConfig";
import dailyData from "./dailyData.json";
import weeklyData from "./weeklyData.json";
import monthlyData from "./monthlyData.json";

export function UsageAnalyticsPage() {
  const { text } = useAppConfig();
  const analyticsText = text?.usageAnalyticsPage || {};
  const [timeFilter, setTimeFilter] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [currentData, setCurrentData] = useState(monthlyData);
  const [animateCards, setAnimateCards] = useState(false);

  // Load data based on selected time filter
  useEffect(() => {
    setLoading(true);
    setAnimateCards(false);

    // Simulate data fetch delay for realistic UX
    const timer = setTimeout(() => {
      if (timeFilter === "daily") {
        setCurrentData(dailyData);
      } else if (timeFilter === "weekly") {
        setCurrentData(weeklyData);
      } else {
        setCurrentData(monthlyData);
      }
      setLoading(false);
      setAnimateCards(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [timeFilter]);

  const handleExport = () => {
    const selectedFilter = analyticsText?.filters?.[timeFilter] || timeFilter;
    toast.success(`${selectedFilter} ${analyticsText?.toasts?.exportSuccessSuffix || "usage report exported successfully"}`);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">{analyticsText?.title || "Usage & Analytics"}</h1>
          <p className="text-muted-foreground">
            {(analyticsText?.subtitle || "Track consumption and analyze usage patterns")} ({analyticsText?.filters?.[timeFilter] || timeFilter})
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={timeFilter} onValueChange={setTimeFilter} disabled={loading}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">{analyticsText?.filters?.daily || "Daily"}</SelectItem>
              <SelectItem value="weekly">{analyticsText?.filters?.weekly || "Weekly"}</SelectItem>
              <SelectItem value="monthly">{analyticsText?.filters?.monthly || "Monthly"}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} disabled={loading}>
            <Download className="w-4 h-4 mr-2" />
            {analyticsText?.buttons?.exportReport || "Export Report"}
          </Button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
          <span className="text-muted-foreground">{analyticsText?.loading?.fetchingData || "Fetching data..."}</span>
        </div>
      )}

      {!loading && (
        <>
          {/* Summary Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 transition-all duration-500 ${animateCards ? "opacity-100" : "opacity-50"}`}>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <p className="text-sm text-muted-foreground mb-1">{analyticsText?.summary?.totalImages || "Total Images"}</p>
              <p className="text-2xl font-semibold">{currentData.summary.totalImages.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">{currentData.summary.imagesTrend} {analyticsText?.summary?.vsLastPeriod || "vs last period"}</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <p className="text-sm text-muted-foreground mb-1">{analyticsText?.summary?.totalVideos || "Total Videos"}</p>
              <p className="text-2xl font-semibold">{currentData.summary.totalVideos.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">{currentData.summary.videosTrend} {analyticsText?.summary?.vsLastPeriod || "vs last period"}</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <p className="text-sm text-muted-foreground mb-1">{analyticsText?.summary?.activeUsers || "Active Users"}</p>
              <p className="text-2xl font-semibold">{currentData.summary.activeUsers}</p>
              <p className="text-xs text-muted-foreground mt-1">{analyticsText?.summary?.thisPeriod || "This"} {analyticsText?.filters?.[timeFilter] || timeFilter}</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <p className="text-sm text-muted-foreground mb-1">{analyticsText?.summary?.avgPerDay || "Avg per Day"}</p>
              <p className="text-2xl font-semibold">{currentData.summary.avgPerDay}</p>
              <p className="text-xs text-muted-foreground mt-1">{analyticsText?.summary?.generations || "Generations"}</p>
            </Card>
          </div>

          {/* Daily/Weekly/Monthly Breakdown Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">{`${analyticsText?.filters?.[timeFilter] || timeFilter} ${analyticsText?.charts?.breakdownSuffix || "Breakdown"}`}</h3>
            {currentData.dailyUsageData && (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={currentData.dailyUsageData} key={timeFilter}>
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
                    name={analyticsText?.charts?.lineImages || "Images"}
                    isAnimationActive={true}
                    animationDuration={500}
                  />
                  <Line
                    type="monotone"
                    dataKey="videos"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ fill: "#06b6d4", r: 5 }}
                    name={analyticsText?.charts?.lineVideos || "Videos"}
                    isAnimationActive={true}
                    animationDuration={500}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* User-Wise Consumption */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">{analyticsText?.charts?.userWiseConsumption || "User-Wise Consumption"}</h3>
            {currentData.userWiseData && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={currentData.userWiseData} key={`bar-${timeFilter}`}>
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
                  <Bar dataKey="images" fill="#4F46E5" radius={[8, 8, 0, 0]} name={analyticsText?.charts?.lineImages || "Images"} isAnimationActive={true} animationDuration={500} />
                  <Bar dataKey="videos" fill="#06b6d4" radius={[8, 8, 0, 0]} name={analyticsText?.charts?.lineVideos || "Videos"} isAnimationActive={true} animationDuration={500} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* User Details Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{analyticsText?.table?.user || "User"}</TableHead>
                  <TableHead className="text-right">{analyticsText?.table?.images || "Images"}</TableHead>
                  <TableHead className="text-right">{analyticsText?.table?.videos || "Videos"}</TableHead>
                  <TableHead className="text-right">{analyticsText?.table?.total || "Total"}</TableHead>
                  <TableHead className="text-right">{analyticsText?.table?.percentOfTotal || "% of Total"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.userWiseData && currentData.userWiseData.map((user) => {
                  const totalUsage = currentData.userWiseData.reduce((sum, u) => sum + u.total, 0);
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
        </>
      )}
    </div>
  );
}













