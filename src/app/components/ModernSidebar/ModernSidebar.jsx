import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
    X,
    Image,
    Video,
    Users,
    FolderSync,
    AlertCircle,
    Settings,
    BarChart3,
    Sparkles,
    Zap,
    Crown,
    ChevronDown,
} from "lucide-react";
import sidebarConfig from "@/appConfig/Sidebar/sidebarConfig";
import { validateLanguage } from "@/appConfig/AppConfig";
import companyLogo from "@/images/fav-icon/venkattech_logo.png";
import { useState } from "react";

const iconMap = {
    Sparkles,
    Image,
    Video,
    Users,
    FolderSync,
    AlertCircle,
    Settings,
    BarChart3,
    Crown,
    ChevronDown,
};

export function ModernSidebar({
    isOpen,
    onClose,
    isLandingPage = false,
    isAuthenticated = false,
    onLoginRequest,
}) {
    const location = useLocation();
    const { lang } = useParams();
    const [openKey, setOpenKey] = useState(null);
    const validatedLang = validateLanguage(lang);

    const toLanguagePath = (path) => `/${validatedLang}${path}`;

    const isActive = (path) => {
        if (isLandingPage) return false;
        return location.pathname === toLanguagePath(path);
    };

    const moduleItems = sidebarConfig.moduleNav || [];
    const logoImage =
        (sidebarConfig.branding.logoImage === "venkattech_logo.png"
            ? companyLogo
            : sidebarConfig.branding.logoImage) || null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: -320 }}
                        animate={{ x: 0 }}
                        exit={{ x: -320 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                        className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-gradient-to-b from-card via-card to-card/95 backdrop-blur-xl border-r border-border shadow-2xl"
                    >
                        {/* Glossy overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                        {/* Content */}
                        <div className="relative h-full flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                                        {logoImage ? (
                                            <img
                                                src={logoImage}
                                                alt={sidebarConfig.branding.logoText}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                                <Sparkles className="w-6 h-6 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold">
                                            {sidebarConfig.branding.logoText}
                                        </h2>
                                        <p className="text-xs text-muted-foreground">
                                            {sidebarConfig.branding.logoTagline}
                                        </p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                                {moduleItems.map((item, index) => {
                                    const Icon = iconMap[item.icon] || Sparkles;
                                    const requiresAuth = item.requiresAuth;
                                    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                                    const open = openKey === item.path;

                                    // item active if path matches or any child path is active
                                    const itemActive = !isLandingPage && (isActive(item.path) || (hasChildren && item.children.some((c) => location.pathname === toLanguagePath(c.path))));

                                    if (isLandingPage) {
                                        return (
                                            <motion.button
                                                key={item.path}
                                                type="button"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                whileHover={{ x: 8 }}
                                                onClick={() => {
                                                    if (requiresAuth && !isAuthenticated) {
                                                        onLoginRequest?.();
                                                    }
                                                    onClose();
                                                }}
                                                className="flex w-full items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted transition-all group"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    <Icon className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className="font-medium">{item.label}</span>
                                            </motion.button>
                                        );
                                    }

                                    return (
                                        <motion.div
                                            key={item.path}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ x: 8 }}
                                        >
                                            {/* Parent item (link or toggle) */}
                                            <div className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${itemActive ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg" : "hover:bg-muted"}`}>
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${itemActive ? "bg-white/20" : "bg-primary/10 group-hover:bg-primary/20"}`}>
                                                    <Icon className={`w-5 h-5 ${itemActive ? "text-white" : "text-primary"}`} />
                                                </div>

                                                {hasChildren ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpenKey(open ? null : item.path)}
                                                        className="flex-1 flex items-center gap-3 text-left"
                                                    >
                                                        <span className="font-medium">{item.label}</span>
                                                        <ChevronDown className={`ml-auto w-4 h-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
                                                    </button>
                                                ) : (
                                                    <Link to={toLanguagePath(item.path)} onClick={onClose} className="flex-1">
                                                        <span className="font-medium">{item.label}</span>
                                                    </Link>
                                                )}
                                            </div>

                                            {/* Children */}
                                            {hasChildren && (
                                                <AnimatePresence>
                                                    {open && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.28 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="mt-2 space-y-1">
                                                                {item.children.map((child) => {
                                                                    const ChildIcon = iconMap[child.icon] || Sparkles;
                                                                    const childActive = !isLandingPage && location.pathname === toLanguagePath(child.path);
                                                                    return (
                                                                        <Link
                                                                            key={child.path}
                                                                            to={toLanguagePath(child.path)}
                                                                            onClick={() => {
                                                                                onClose();
                                                                                setOpenKey(item.path);
                                                                            }}
                                                                            className={`flex items-center gap-3 pl-12 pr-4 py-2 rounded-lg transition-all ${childActive ? "bg-white/5 border-l-2 border-primary" : "hover:bg-white/5"}`}
                                                                        >
                                                                            <div className="w-7 h-7 rounded-md flex items-center justify-center">
                                                                                <ChildIcon className={`w-4 h-4 ${childActive ? "text-white" : "text-primary/70"}`} />
                                                                            </div>
                                                                            <span className={`sub-navigation-text text-sm ${childActive ? "text-white" : "text-white/80"}`}>{child.label}</span>
                                                                        </Link>
                                                                    );
                                                                })}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </nav>

                            {/* Footer with upgrade prompt */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="p-4 border-t border-border/50"
                            >
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                            <Crown className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-sm mb-1">
                                                Upgrade to Pro
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                Unlock unlimited generations
                                            </p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-primary to-accent text-white text-sm font-medium shadow-lg"
                                    >
                                        <Zap className="w-4 h-4 inline mr-2" />
                                        Upgrade Now
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
