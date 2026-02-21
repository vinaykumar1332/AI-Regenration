import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Clapperboard,
    CreditCard,
    ChevronDown,
    Bell,
    ImageIcon,
    Layers,
    LogIn,
    LogOut,
    Mail,
    Menu,
    Package,
    Settings,
    Shirt,
    Sparkles,
    Sun,
    Tag,
    Moon,
    UserRound,
    Video,
} from "lucide-react";
import navigationConfig from "@/appConfig/i18n/en/navigation/navigation.json";
import "./DynamicIslandNav.css";

const iconMap = {
    ImageIcon,
    VideoIcon: Video,
    TagIcon: Tag,
    SparklesIcon: Sparkles,
    MailIcon: Mail,
    LogInIcon: LogIn,
    ShirtIcon: Shirt,
    LayersIcon: Layers,
    ClapperboardIcon: Clapperboard,
    PackageIcon: Package,
    BellIcon: Bell,
    UserIcon: UserRound,
    SettingsIcon: Settings,
    LogOutIcon: LogOut,
    CreditCardIcon: CreditCard,
};

function NavIcon({ iconName }) {
    const Icon = iconMap[iconName] || Sparkles;
    return <Icon className="nav-item-icon" aria-hidden="true" />;
}

export function Navigation({ onMenuClick, onLoginClick, isAuthenticated, isLandingPage, onLogout, user }) {
    const USER_MENU_KEY = "__user_menu__";
    const NOTIFICATIONS_KEY = "__notifications__";
    const navigate = useNavigate();
    const location = useLocation();
    const navRef = useRef(null);
    const subnavRef = useRef(null);
    const [activeDropdownKey, setActiveDropdownKey] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: "success",
            title: "Generation Complete",
            message: "Your image generation completed successfully",
            timestamp: "2 minutes ago",
            read: false,
        },
        {
            id: 2,
            type: "info",
            title: "New Feature Available",
            message: "Try our new bulk processing capabilities",
            timestamp: "1 hour ago",
            read: false,
        },
        {
            id: 3,
            type: "alert",
            title: "Job Failed",
            message: "Video generation failed due to timeout",
            timestamp: "3 hours ago",
            read: true,
        },
    ]);
    const [isDark, setIsDark] = useState(() => {
        try {
            return document.documentElement.classList.contains("dark");
        } catch {
            return true;
        }
    });

    const shouldShowThemeToggle = Boolean(isAuthenticated) && !Boolean(isLandingPage);

    const navItems = useMemo(() => navigationConfig.items || [], []);
    const userConfig = navigationConfig.user || {};
    const loginItem = navigationConfig.login;
    const brandLabel = navigationConfig.brand?.label || "AI Studio";

    const activeNavItem = useMemo(
        () => navItems.find((item) => item.key === activeDropdownKey && item.children?.length),
        [activeDropdownKey, navItems],
    );
    const isUserMenuOpen = activeDropdownKey === USER_MENU_KEY;
    const isNotificationsOpen = activeDropdownKey === NOTIFICATIONS_KEY;

    const mobileUserMenuExtras = useMemo(() => {
        if (!isMobile || !shouldShowThemeToggle) return [];

        return [
            {
                key: "mobile_theme",
                icon: isDark ? "SunIcon" : "MoonIcon",
                label: isDark ? "Light Theme" : "Dark Theme",
                action: "toggle-theme",
            },
        ];
    }, [isDark, isMobile, shouldShowThemeToggle]);

    const unreadNotificationsCount = useMemo(
        () => notifications.filter((notif) => !notif.read).length,
        [notifications],
    );

    const activeSubmenuItems = isUserMenuOpen
        ? [...(userConfig.menu || []), ...mobileUserMenuExtras]
        : isNotificationsOpen
            ? notifications.map((notif) => ({
                key: `notif_${notif.id}`,
                icon: "BellIcon",
                label: notif.title,
            }))
            : activeNavItem?.children || [];

    const userName = user?.username || userConfig.name || "User";
    const userEmail = userConfig.email || "";
    const userInitials = useMemo(() => {
        const parts = userName
            .split(" ")
            .map((part) => part.trim())
            .filter(Boolean)
            .slice(0, 2);

        if (!parts.length) {
            return "JD";
        }

        return parts.map((part) => part[0]?.toUpperCase() || "").join("");
    }, [userName]);

    const languagePrefix = useMemo(() => {
        const [firstSegment] = location.pathname.split("/").filter(Boolean);
        if (!firstSegment || firstSegment.length !== 2) {
            return "";
        }
        return `/${firstSegment}`;
    }, [location.pathname]);

    const getLocalizedPath = (path) => {
        if (!path) {
            return languagePrefix || "/";
        }

        if (!path.startsWith("/")) {
            return `${languagePrefix}/${path}`;
        }

        if (!languagePrefix || path.startsWith(`${languagePrefix}/`) || path === languagePrefix) {
            return path;
        }

        return `${languagePrefix}${path}`;
    };

    const toggleTheme = () => {
        setIsDark((prev) => {
            const next = !prev;
            try {
                document.documentElement.classList.toggle("dark", next);
            } catch {
                // ignore
            }
            return next;
        });
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    useEffect(() => {
        const onScroll = () => {
            setIsScrolled(window.scrollY > 1.25 * 16);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const mq = "(max-width: 48rem)";
        const media = window.matchMedia(mq);
        const apply = (matches) => {
            const fallback = typeof window !== "undefined" && window.innerWidth <= 768;
            setIsMobile(Boolean(matches || fallback));
            setActiveDropdownKey(null);
        };

        const onMediaChange = (event) => apply(event.matches);
        apply(media.matches);

        if (media.addEventListener) {
            media.addEventListener("change", onMediaChange);
        } else if (media.addListener) {
            media.addListener(onMediaChange);
        }

        const onResize = () => apply(media.matches);
        window.addEventListener("resize", onResize);

        return () => {
            if (media.removeEventListener) {
                media.removeEventListener("change", onMediaChange);
            } else if (media.removeListener) {
                media.removeListener(onMediaChange);
            }
            window.removeEventListener("resize", onResize);
        };
    }, []);

    useEffect(() => {
        const onPointerDown = (event) => {
            if (!navRef.current && !subnavRef.current) {
                return;
            }

            const isInsideNav = navRef.current?.contains(event.target);
            const isInsideSubnav = subnavRef.current?.contains(event.target);

            if (isInsideNav || isInsideSubnav) {
                return;
            }

            setActiveDropdownKey(null);
        };

        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, []);

    const handleTopItemClick = (item) => {
        if (item.children?.length) {
            setActiveDropdownKey((prev) => (prev === item.key ? null : item.key));
            return;
        }

        if (item.requiresAuth && !isAuthenticated) {
            // Remember intended route for post-login redirect
            try {
                const target = getLocalizedPath(item.path);
                window.sessionStorage.setItem("intendedRoute", target);
            } catch {
                // ignore
            }
            onLoginClick?.();
            return;
        }

        setActiveDropdownKey(null);
        navigate(getLocalizedPath(item.path));
    };

    const handleChildClick = (child) => {
        if (child.requiresAuth && !isAuthenticated) {
            try {
                const target = getLocalizedPath(child.path);
                window.sessionStorage.setItem("intendedRoute", target);
            } catch {
                // ignore
            }
            onLoginClick?.();
            return;
        }

        setActiveDropdownKey(null);
        navigate(getLocalizedPath(child.path));
    };

    const handleSubmenuAction = (item) => {
        if (item.action === "toggle-theme") {
            toggleTheme();
            setActiveDropdownKey(null);
            return;
        }

        setActiveDropdownKey(null);
        if (item.action === "logout") {
            onLogout?.();
            return;
        }

        if (item.path) {
            navigate(getLocalizedPath(item.path));
        }
    };

    const handleNavMouseLeave = (event) => {
        if (isMobile || !navRef.current) {
            return;
        }

        // Don't close dropdown if moving to the dropdown itself
        // Guard against relatedTarget not being a DOM Node (prevents "contains" TypeError)
        const related = event.relatedTarget;
        if (related && typeof related.nodeType === "number" && navRef.current.contains(related)) {
            return;
        }

        // Small delay to allow hover bridge to work
        setTimeout(() => {
            setActiveDropdownKey(null);
        }, 50);
    };

    return (
        <header className="nav-shell" data-scrolled={isScrolled}>
            <div
                className="dynamic-island-nav"
                ref={navRef}
                data-scrolled={isScrolled}
                onMouseLeave={handleNavMouseLeave}
            >
                <div className="nav-glossy-overlay" />

                <div className="dynamic-island-nav-content">
                    {onMenuClick ? (
                        <button
                            type="button"
                            className="nav-hamburger-btn"
                            onClick={onMenuClick}
                            aria-label="Open sidebar"
                        >
                            <Menu className="nav-item-icon" aria-hidden="true" />
                        </button>
                    ) : (
                        <div className="nav-hamburger-btn" aria-hidden="true" />
                    )}

                    <div
                        className="nav-brand"
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(languagePrefix || "/")}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                navigate(languagePrefix || "/");
                            }
                        }}
                    >
                        <span className="nav-brand-mark" aria-hidden="true">
                            <Sparkles className="nav-item-icon" aria-hidden="true" />
                        </span>
                        <span className="nav-brand-label">{brandLabel}</span>
                    </div>

                    <div className="nav-center-wrap">
                        <nav className="nav-scroll-track" aria-label="Primary Navigation">
                            {navItems.map((item) => {
                                const hasChildren = Boolean(item.children?.length);
                                const isOpen = activeDropdownKey === item.key && !isMobile;

                                return (
                                    <div
                                        key={item.key}
                                        className="nav-item-wrap"
                                        onMouseEnter={() => {
                                            if (!isMobile && hasChildren) {
                                                setActiveDropdownKey(item.key);
                                            }
                                        }}
                                    >
                                        <button
                                            type="button"
                                            className="nav-item"
                                            onClick={() => handleTopItemClick(item)}
                                            aria-expanded={hasChildren ? isOpen : undefined}
                                        >
                                            <NavIcon iconName={item.icon} />
                                            <span className="nav-item-label">{item.label}</span>
                                            {hasChildren ? (
                                                <ChevronDown className={`nav-chevron ${isOpen ? "is-open" : ""}`} />
                                            ) : null}
                                        </button>

                                        {hasChildren && !isMobile ? (
                                            <div
                                                className={`nav-dropdown ${isOpen ? "is-open" : ""}`}
                                                role="menu"
                                                aria-hidden={!isOpen}
                                            >
                                                {item.children.map((child) => (
                                                    <button
                                                        key={child.key}
                                                        type="button"
                                                        className="nav-dropdown-item"
                                                        onClick={() => handleChildClick(child)}
                                                    >
                                                        <NavIcon iconName={child.icon || "SparklesIcon"} />
                                                        {child.label}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </nav>
                    </div>

                    <div
                        className="nav-auth-wrap"
                    >
                        {isMobile && isAuthenticated ? (
                            <button
                                type="button"
                                className="nav-auth-btn nav-mobile-notif-btn"
                                aria-label={
                                    unreadNotificationsCount
                                        ? `Notifications (${unreadNotificationsCount} unread)`
                                        : "Notifications"
                                }
                                aria-expanded={isNotificationsOpen}
                                onClick={() =>
                                    setActiveDropdownKey((prev) => (prev === NOTIFICATIONS_KEY ? null : NOTIFICATIONS_KEY))
                                }
                            >
                                <Bell className="nav-item-icon" aria-hidden="true" />
                                {unreadNotificationsCount ? (
                                    <span className="nav-notif-dot" aria-hidden="true" />
                                ) : null}
                            </button>
                        ) : null}

                        {!isMobile && isAuthenticated ? (
                            <>
                                <button
                                    type="button"
                                    className="nav-auth-btn"
                                    aria-label="Notifications"
                                    aria-expanded={isNotificationsOpen}
                                    onClick={() =>
                                        setActiveDropdownKey((prev) => (prev === NOTIFICATIONS_KEY ? null : NOTIFICATIONS_KEY))
                                    }
                                >
                                    <Bell className="nav-item-icon" aria-hidden="true" />
                                </button>

                                {isNotificationsOpen && !isMobile ? (
                                    <div
                                        className="nav-dropdown nav-dropdown-notifications is-open"
                                        role="menu"
                                        aria-hidden={!isNotificationsOpen}
                                    >
                                        <div className="nav-dropdown-section">
                                            <p className="nav-dropdown-title">Notifications</p>
                                            <p className="nav-dropdown-subtitle">
                                                {notifications.length} notification{notifications.length === 1 ? "" : "s"}
                                            </p>
                                        </div>

                                        {notifications.length ? (
                                            <div className="nav-dropdown-notifications-list">
                                                {notifications.map((notif) => (
                                                    <div key={notif.id} className="nav-notification-item">
                                                        <div className="nav-notification-text">
                                                            <p className="nav-notification-title">{notif.title}</p>
                                                            <p className="nav-notification-message">{notif.message}</p>
                                                            <p className="nav-notification-time">{notif.timestamp}</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="nav-notification-remove"
                                                            onClick={() => removeNotification(notif.id)}
                                                            aria-label="Remove notification"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="nav-dropdown-empty">All caught up!</div>
                                        )}

                                        {notifications.length ? (
                                            <button
                                                type="button"
                                                className="nav-dropdown-item"
                                                onClick={clearAllNotifications}
                                            >
                                                Clear All
                                            </button>
                                        ) : null}
                                    </div>
                                ) : null}
                            </>
                        ) : null}

                        {!isMobile && shouldShowThemeToggle ? (
                            <button
                                type="button"
                                className="nav-auth-btn"
                                aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                                onClick={toggleTheme}
                            >
                                {isDark ? (
                                    <Sun className="nav-item-icon" aria-hidden="true" />
                                ) : (
                                    <Moon className="nav-item-icon" aria-hidden="true" />
                                )}
                            </button>
                        ) : null}

                        {isAuthenticated ? (
                            <>
                                <button
                                    type="button"
                                    className="nav-auth-btn nav-user-btn"
                                    onMouseEnter={() => {
                                        if (!isMobile) {
                                            setActiveDropdownKey(USER_MENU_KEY);
                                        }
                                    }}
                                    onClick={() =>
                                        setActiveDropdownKey((prev) => (prev === USER_MENU_KEY ? null : USER_MENU_KEY))
                                    }
                                    aria-label="Open user menu"
                                >
                                    <span className="nav-user-initials" aria-hidden="true">
                                        {userInitials}
                                    </span>
                                    <span className="nav-auth-label">{userName}</span>
                                    <ChevronDown className={`nav-chevron ${isUserMenuOpen ? "is-open" : ""}`} />
                                </button>

                                {isUserMenuOpen && !isMobile ? (
                                    <div className="nav-dropdown nav-dropdown-user is-open" role="menu" aria-hidden={!isUserMenuOpen}>
                                        <div className="nav-user-card">
                                            <span className="nav-user-card-initials" aria-hidden="true">
                                                {userInitials}
                                            </span>
                                            <div className="nav-user-card-text">
                                                <p className="nav-user-card-name">{userName}</p>
                                                <p className="nav-user-card-email">{userEmail}</p>
                                            </div>
                                        </div>
                                        {userConfig.menu?.map((child) => (
                                            <button
                                                key={child.key}
                                                type="button"
                                                className="nav-dropdown-item"
                                                onClick={() => handleSubmenuAction(child)}
                                            >
                                                <NavIcon iconName={child.icon || "UserIcon"} />
                                                {child.label}
                                            </button>
                                        ))}
                                    </div>
                                ) : null}
                            </>
                        ) : (
                            <button
                                type="button"
                                className="nav-auth-btn nav-login-btn"
                                onClick={() => {
                                    if (onLoginClick) {
                                        try {
                                            const target = location.pathname + location.search + location.hash;
                                            window.sessionStorage.setItem("intendedRoute", target);
                                        } catch {
                                            // ignore
                                        }
                                        onLoginClick();
                                        return;
                                    }
                                    navigate(getLocalizedPath(loginItem?.path || "/login"));
                                }}
                                aria-label={loginItem?.label || "Login"}
                            >
                                <NavIcon iconName={loginItem?.icon || "LogInIcon"} />
                                <span className="nav-auth-label">{loginItem?.label || "Login"}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {isMobile ? (
                <div
                    ref={subnavRef}
                    className={`nav-subnav ${activeSubmenuItems.length ? "is-open" : ""} ${activeSubmenuItems.length === 1 ? "is-single" : ""
                        } ${isUserMenuOpen ? "is-user" : ""}`}
                    role="menu"
                    aria-hidden={!activeSubmenuItems.length}
                >
                    {isUserMenuOpen ? (
                        <div className="nav-user-card">
                            <span className="nav-user-card-initials" aria-hidden="true">
                                {userInitials}
                            </span>
                            <div className="nav-user-card-text">
                                <p className="nav-user-card-name">{userName}</p>
                                <p className="nav-user-card-email">{userEmail}</p>
                            </div>
                        </div>
                    ) : null}

                    {activeSubmenuItems.map((child) => (
                        <button
                            key={child.key}
                            type="button"
                            className="nav-dropdown-item"
                            onClick={() => {
                                if (isUserMenuOpen) {
                                    handleSubmenuAction(child);
                                    return;
                                }
                                if (isNotificationsOpen) {
                                    setActiveDropdownKey(null);
                                    return;
                                }
                                handleChildClick(child);
                            }}
                        >
                            <NavIcon iconName={child.icon || "SparklesIcon"} />
                            {child.label}
                        </button>
                    ))}
                </div>
            ) : null}
        </header>
    );
}
