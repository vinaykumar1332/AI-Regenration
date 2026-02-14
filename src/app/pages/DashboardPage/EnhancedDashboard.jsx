import { motion } from "motion/react";
import { Card } from "@/app/components/ui/Card/card";
import { Progress } from "@/app/components/ui/Progress/progress";
import { Badge } from "@/app/components/ui/Badge/badge";
import {
    Image,
    Video,
    Users,
    Activity,
    TrendingUp,
    Zap,
    Clock,
    CheckCircle,
    AlertCircle,
    Sparkles,
    Calendar,
    DollarSign,
    BarChart3,
} from "lucide-react";

const stats = [
    {
        title: "Images Created",
        value: "2,847",
        change: "+23.5%",
        trend: "up",
        icon: Image,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-500/10",
    },
    {
        title: "Videos Generated",
        value: "1,432",
        change: "+18.2%",
        trend: "up",
        icon: Video,
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-500/10",
    },
    {
        title: "Avatars Built",
        value: "856",
        change: "+42.8%",
        trend: "up",
        icon: Users,
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-500/10",
    },
    {
        title: "Success Rate",
        value: "98.5%",
        change: "+2.1%",
        trend: "up",
        icon: CheckCircle,
        color: "from-orange-500 to-red-500",
        bgColor: "bg-orange-500/10",
    },
];

const recentActivity = [
    {
        type: "image",
        title: "Fashion Model Portrait",
        time: "2 minutes ago",
        status: "completed",
    },
    {
        type: "video",
        title: "Product Showcase",
        time: "15 minutes ago",
        status: "completed",
    },
    {
        type: "avatar",
        title: "3D Character Design",
        time: "1 hour ago",
        status: "processing",
    },
    {
        type: "image",
        title: "Landscape Scene",
        time: "2 hours ago",
        status: "completed",
    },
    {
        type: "video",
        title: "Animation Render",
        time: "3 hours ago",
        status: "failed",
    },
];

const quickActions = [
    {
        title: "Generate Image",
        icon: Image,
        color: "from-blue-500 to-cyan-500",
        desc: "Create stunning AI images",
    },
    {
        title: "Create Video",
        icon: Video,
        color: "from-purple-500 to-pink-500",
        desc: "Generate dynamic videos",
    },
    {
        title: "Build Avatar",
        icon: Users,
        color: "from-green-500 to-emerald-500",
        desc: "Design unique avatars",
    },
    {
        title: "Bulk Process",
        icon: Zap,
        color: "from-orange-500 to-red-500",
        desc: "Process in batches",
    },
];

export function EnhancedDashboard() {
    const monthlyUsage = 12450;
    const monthlyLimit = 20000;
    const usagePercentage = (monthlyUsage / monthlyLimit) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-8">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute w-96 h-96 rounded-full bg-primary/5 blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ top: "20%", left: "10%" }}
                />
                <motion.div
                    className="absolute w-96 h-96 rounded-full bg-accent/5 blur-3xl"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    style={{ bottom: "20%", right: "10%" }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                            Creative Dashboard
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Welcome back! Here's your creative overview
                        </p>
                    </div>
                    <Badge className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white border-none">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Pro Plan
                    </Badge>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300">
                                    <div className="flex items-start justify-between mb-4">
                                        <div
                                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                                        >
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className={`${stat.bgColor} border-none`}
                                        >
                                            <TrendingUp className="w-3 h-3 mr-1" />
                                            {stat.change}
                                        </Badge>
                                    </div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                        {stat.title}
                                    </h3>
                                    <p className="text-3xl font-bold">{stat.value}</p>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Usage Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Card className="p-6 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold mb-1">Monthly Usage</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {monthlyUsage.toLocaleString()} /{" "}
                                        {monthlyLimit.toLocaleString()} generations
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-primary" />
                                    <span className="font-semibold">{usagePercentage.toFixed(1)}%</span>
                                </div>
                            </div>
                            <Progress value={usagePercentage} className="h-3 mb-4" />
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                <div className="text-center p-4 rounded-xl bg-blue-500/10">
                                    <Image className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                                    <p className="text-2xl font-bold mb-1">7.2K</p>
                                    <p className="text-xs text-muted-foreground">Images</p>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-purple-500/10">
                                    <Video className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                                    <p className="text-2xl font-bold mb-1">3.8K</p>
                                    <p className="text-xs text-muted-foreground">Videos</p>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-green-500/10">
                                    <Users className="w-6 h-6 mx-auto mb-2 text-green-500" />
                                    <p className="text-2xl font-bold mb-1">1.4K</p>
                                    <p className="text-xs text-muted-foreground">Avatars</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="p-6 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                {quickActions.map((action, index) => {
                                    const Icon = action.icon;
                                    return (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all text-left group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}
                                                >
                                                    <Icon className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold group-hover:text-primary transition-colors">
                                                        {action.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {action.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="p-6 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Recent Activity</h3>
                            <button className="text-sm text-primary hover:underline">
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all"
                                >
                                    <div
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.type === "image"
                                                ? "bg-blue-500/10"
                                                : activity.type === "video"
                                                    ? "bg-purple-500/10"
                                                    : "bg-green-500/10"
                                            }`}
                                    >
                                        {activity.type === "image" && (
                                            <Image className="w-5 h-5 text-blue-500" />
                                        )}
                                        {activity.type === "video" && (
                                            <Video className="w-5 h-5 text-purple-500" />
                                        )}
                                        {activity.type === "avatar" && (
                                            <Users className="w-5 h-5 text-green-500" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{activity.title}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {activity.time}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            activity.status === "completed"
                                                ? "default"
                                                : activity.status === "processing"
                                                    ? "secondary"
                                                    : "destructive"
                                        }
                                    >
                                        {activity.status === "completed" && (
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                        )}
                                        {activity.status === "processing" && (
                                            <Clock className="w-3 h-3 mr-1" />
                                        )}
                                        {activity.status === "failed" && (
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                        )}
                                        {activity.status}
                                    </Badge>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
