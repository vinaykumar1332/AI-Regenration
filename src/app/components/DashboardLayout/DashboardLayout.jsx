import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/app/components/ui/Button/button";
import { Input } from "@/app/components/ui/Input/input";
import { Avatar, AvatarFallback } from "@/app/components/ui/Avatar/avatar";
import { ThemeToggle } from "@/app/components/ThemeToggle/ThemeToggle";
import { Footer } from "@/app/components/Footer/Footer";
import { UserProfileModal } from "@/app/components/UserProfileModal/UserProfileModal";
import { NotificationPanel } from "@/app/components/NotificationPanel/NotificationPanel";
import {
  LayoutDashboard,
  Image,
  Video,
  FolderSync,
  AlertCircle,
  BarChart3,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  Sparkles,
  LogOut,
  User,
  Users,
} from "lucide-react";



const navItems = [
  // { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Image, label: "Image Generation", path: "/image-generation" },
  { icon: Video, label: "Video Generation", path: "/video-generation" },
  { icon: Users, label: "Avatar Generation", path: "/avatar-generation" },
  { icon: FolderSync, label: "Bulk Generation", path: "/bulk-generation" },
  { icon: AlertCircle, label: "Failed Jobs", path: "/failed-jobs" },
  // { icon: BarChart3, label: "Usage & Analytics", path: "/usage-analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function DashboardLayout({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasNotifications] = useState(true);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    onLogout();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-16 items-center gap-4 px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold hidden sm:block">venkatTech media studio</span>
          </div>

          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.div
              animate={hasNotifications ? { rotate: [0, -10, 10, -10, 0] } : {}}
              transition={hasNotifications ? { duration: 0.5, repeat: Infinity, repeatDelay: 4 } : {}}
            >
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsNotificationOpen(true)}
              >
                <Bell className="w-5 h-5" />
                {hasNotifications && (
                  <motion.span
                    className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </Button>
            </motion.div>

            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => setIsProfileOpen(true)}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-white">JD</AvatarFallback>
              </Avatar>
              <span className="hidden md:block">John Doe</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed lg:sticky lg:translate-x-0 top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card transition-transform duration-300`}
        >
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
          <Footer />
        </main>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={handleLogout}
      />

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
}













