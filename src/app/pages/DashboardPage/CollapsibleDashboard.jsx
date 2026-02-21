import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAppConfig } from "@/appConfig/useAppConfig";
import { Card } from "@/app/components/ui/Card/card";
import { Badge } from "@/app/components/ui/Badge/badge";
import { Button } from "@/app/components/ui/Button/button";
import {
    Image,
    Video,
    Users,
    FolderSync,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Zap,
    CheckCircle,
    Activity,
    Star,
    Code,
    ArrowRight,
    Clock,
    TrendingUp,
} from "lucide-react";

const iconMap = {
    Image,
    Video,
    Users,
    FolderSync,
    Sparkles,
    Zap,
    CheckCircle,
    Activity,
    Star,
    Code,
    TrendingUp,
};

export function CollapsibleDashboard() {
    const navigate = useNavigate();
    const { text } = useAppConfig();
    const dashboardData = text?.dashboardData || {};
    const dashboardUi = text?.dashboardUi || {};
    const sections = dashboardData?.dashboardSections || [];
    const modules = dashboardData?.modules || [];
    const overview = sections[0] || {};
    const quickStats = sections[1] || {};
    const featuredModules = sections[2] || {};
    const recentActivity = sections[3] || {};
    const proFeatures = sections[4] || {};
    const [expandedSections, setExpandedSections] = useState({
        overview: true,
        quickStats: true,
        modules: true,
        recentActivity: true,
        proFeatures: false,
    });

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleModuleClick = (module) => {
        navigate(module.path);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-8">
            {/* Animated Background */}
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
                {/* Overview Section */}
                <CollapsibleSection
                    title={overview.title}
                    subtitle={overview.subtitle}
                    isExpanded={expandedSections.overview}
                    onToggle={() => toggleSection("overview")}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative rounded-3xl overflow-hidden"
                    >
                        <img
                            src={overview.image}
                            alt={dashboardUi?.overviewImageAlt || "Welcome"}
                            className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                            <div className="p-8 text-white">
                                <h2 className="text-3xl font-bold mb-2">
                                    {overview.title}
                                </h2>
                                <p className="text-lg text-white/80 mb-4">
                                    {overview.description}
                                </p>
                                <Button
                                    size="lg"
                                    className="bg-white text-black hover:bg-white/90"
                                >
                                    {overview?.cta?.text}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </CollapsibleSection>

                {/* Quick Stats Section */}
                <CollapsibleSection
                    title={quickStats.title}
                    isExpanded={expandedSections.quickStats}
                    onToggle={() => toggleSection("quickStats")}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(quickStats.cards || []).map((stat, index) => {
                            const Icon = iconMap[stat.icon];
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <Badge
                                                variant={
                                                    stat.change.startsWith("+")
                                                        ? "default"
                                                        : "secondary"
                                                }
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
                </CollapsibleSection>

                {/* AI Generation Modules Section */}
                <CollapsibleSection
                    title={featuredModules.title}
                    subtitle={featuredModules.subtitle}
                    isExpanded={expandedSections.modules}
                    onToggle={() => toggleSection("modules")}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {modules.map((module, index) => {
                            const Icon = iconMap[module.icon];
                            return (
                                <motion.div
                                    key={module.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleModuleClick(module)}
                                    className="cursor-pointer"
                                >
                                    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all group">
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={module.image}
                                                alt={module.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div
                                                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center`}
                                                    >
                                                        <Icon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white">
                                                        {module.title}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <p className="text-muted-foreground mb-4">
                                                {module.description}
                                            </p>
                                            <div className="space-y-2 mb-4">
                                                {module.features.map((feature, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-2 text-sm"
                                                    >
                                                        <CheckCircle className="w-4 h-4 text-primary" />
                                                        <span>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t">
                                                <div className="flex gap-4 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            {dashboardUi?.moduleStatsGenerated || "Generated:"}{" "}
                                                        </span>
                                                        <span className="font-semibold">
                                                            {module.stats.generated || module.stats.capacity || "-"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            {dashboardUi?.moduleStatsTime || "Time:"}{" "}
                                                        </span>
                                                        <span className="font-semibold">
                                                            {module.stats.avgTime}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Badge className={`bg-gradient-to-r ${module.color}`}>
                                                    {module.stats.quality}
                                                </Badge>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </CollapsibleSection>

                {/* Recent Activity Section */}
                <CollapsibleSection
                    title={recentActivity.title}
                    subtitle={recentActivity.subtitle}
                    isExpanded={expandedSections.recentActivity}
                    onToggle={() => toggleSection("recentActivity")}
                >
                    <div className="space-y-4">
                        {(recentActivity.items || []).map((item, index) => {
                            const Icon =
                                item.type === "image"
                                    ? Image
                                    : item.type === "video"
                                        ? Video
                                        : Users;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ x: 5 }}
                                >
                                    <Card className="p-4 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.thumbnail}
                                                alt={item.title}
                                                className="w-20 h-20 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Icon className="w-4 h-4 text-primary" />
                                                    <h4 className="font-semibold">{item.title}</h4>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{item.timestamp}</span>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={
                                                    item.status === "completed"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {item.status === "completed" && (
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                )}
                                                {item.status === "processing" && (
                                                    <Clock className="w-3 h-3 mr-1" />
                                                )}
                                                {item.status}
                                            </Badge>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </CollapsibleSection>

                {/* Pro Features Section */}
                <CollapsibleSection
                    title={proFeatures.title}
                    subtitle={proFeatures.subtitle}
                    isExpanded={expandedSections.proFeatures}
                    onToggle={() => toggleSection("proFeatures")}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(proFeatures.features || []).map(
                            (feature, index) => {
                                const Icon = iconMap[feature.icon];
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -5 }}
                                    >
                                        <Card className="p-6 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:border-primary/50 transition-all text-center">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-lg font-bold mb-2">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {feature.description}
                                            </p>
                                        </Card>
                                    </motion.div>
                                );
                            }
                        )}
                    </div>
                    <div className="mt-6 text-center">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-primary to-accent text-white"
                        >
                            <Star className="w-5 h-5 mr-2" />
                            {dashboardUi?.upgradeToPro || "Upgrade to Pro"}
                        </Button>
                    </div>
                </CollapsibleSection>
            </div>
        </div>
    );
}

// Collapsible Section Component
function CollapsibleSection({
    title,
    subtitle,
    isExpanded,
    onToggle,
    children,
}) {
    return (
        <Card className="bg-card/50 backdrop-blur-sm border-2">
            <div
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={onToggle}
            >
                <div>
                    <h2 className="text-2xl font-bold mb-1">{title}</h2>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                    )}
                </div>
                <motion.button
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center"
                >
                    <ChevronDown className="w-6 h-6" />
                </motion.button>
            </div>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}
