import { useState, useEffect } from "react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "motion/react";
import { Button } from "@/app/components/ui/Button/button";
import {
    Menu,
    X,
    Sparkles,
    Home,
    Image,
    Video,
    Users,
    Wand2,
    Settings,
    LogOut,
    User,
} from "lucide-react";

export function DynamicIslandNav({
    onMenuClick,
    onLoginClick,
    isAuthenticated,
    onLogout,
    isLandingPage = false,
}) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isScrollingUp, setIsScrollingUp] = useState(true);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? latest;
        setIsScrollingUp(latest < previous);
    });

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        const handleChange = (event) => setIsMobile(event.matches);

        handleChange(mediaQuery);
        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const navItems = isLandingPage
        ? [
            { label: "Home", icon: Home },
            { label: "Features", icon: Sparkles },
            { label: "Models", icon: Wand2 },
        ]
        : [
            { label: "Images", icon: Image },
            { label: "Videos", icon: Video },
            { label: "Avatars", icon: Users },
        ];

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-6"
        >
            <motion.div
                initial={false}
                animate={{
                    width: isScrollingUp
                        ? isMobile
                            ? "96vw"
                            : "94%"
                        : isMobile
                            ? "82vw"
                            : "78%",
                    height: isExpanded ? "auto" : "60px",
                    backgroundColor: isScrolled
                        ? "rgba(0, 0, 0, 0.85)"
                        : "rgba(0, 0, 0, 0.7)",
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 35,
                }}
                className="dynamic-island-nav relative backdrop-blur-2xl border border-white/10 rounded-[30px] shadow-2xl overflow-hidden"
                style={{
                    maxWidth: "min(1200px, 96vw)",
                    minWidth: "min(92vw, 560px)",
                    boxShadow: isScrolled
                        ? "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                        : "0 4px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                }}
            >
                {/* Glossy overlay effect */}
                <div className="nav-glossy-overlay absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                {/* Main Navigation Content */}
                <div className="relative flex items-center justify-between h-[60px] px-6">
                    {/* Left: Hamburger Menu */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onMenuClick}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all shadow-lg hover:shadow-xl"
                    >
                        <Menu className="w-5 h-5 text-white" />
                    </motion.button>

                    {/* Center: Logo and Nav Items */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-6">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="nav-logo-container flex items-center gap-2 cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white font-semibold text-lg hidden sm:block">
                                AI Studio
                            </span>
                        </motion.div>

                        {/* Desktop Nav Items */}
                        <nav className="hidden md:flex items-center gap-2">
                            {navItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="nav-item flex items-center gap-2 px-4 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </motion.button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right: Login/Profile Button */}
                    {isAuthenticated ? (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg hover:shadow-xl"
                        >
                            <User className="w-5 h-5" />
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onLoginClick}
                            className="px-6 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium text-sm shadow-lg hover:shadow-xl"
                        >
                            Login
                        </motion.button>
                    )}
                </div>

                {/* Expanded User Menu */}
                <AnimatePresence>
                    {isExpanded && isAuthenticated && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-white/10"
                        >
                            <div className="px-6 py-4 space-y-2">
                                <motion.button
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-white/80 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <User className="w-5 h-5" />
                                    <span>Profile</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-white/80 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <Settings className="w-5 h-5" />
                                    <span>Settings</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ x: 4 }}
                                    onClick={onLogout}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.header>
    );
}
