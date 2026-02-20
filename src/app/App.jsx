import { useState, useEffect, lazy, Suspense, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams, useNavigate } from "react-router-dom";
import { Toaster } from "@/app/components/ui/Sonner/sonner";
import { Preloader } from "@/app/components/Preloader/Preloader";
import { LandingPage } from "@/app/pages/LandingPage/LandingPage";
import { DynamicIslandNav } from "@/app/components/DynamicIslandNav/DynamicIslandNav";
import { ModernSidebar } from "@/app/components/ModernSidebar/ModernSidebar";
import { LoginModal } from "@/app/components/LoginModal/LoginModal";
import { CollapsibleDashboard } from "@/app/pages/DashboardPage/CollapsibleDashboard";
import { SmoothScrollWrapper } from "@/app/components/SmoothScrollWrapper/SmoothScrollWrapper";
import { defaultLanguage, validateLanguage } from "@/appConfig/AppConfig";
import { useAppConfig } from "@/appConfig/useAppConfig";

// Lazy load page components for better code splitting
const ImageGenerationPage = lazy(() =>
  import("@/app/pages/ImageGenerationPage/ImageGenerationPage").then(m => ({ default: m.ImageGenerationPage }))
);
const VideoGenerationPage = lazy(() =>
  import("@/app/pages/VideoGenerationPage/VideoGenerationPage").then(m => ({ default: m.VideoGenerationPage }))
);
const AvatarGenerationPage = lazy(() =>
  import("@/app/pages/AvatarGenerationPage/AvatarGenerationPage").then(m => ({ default: m.AvatarGenerationPage }))
);
const BulkGenerationPage = lazy(() =>
  import("@/app/pages/BulkGenerationPage/BulkGenerationPage").then(m => ({ default: m.BulkGenerationPage }))
);
const SwapFaceGenerationPage = lazy(() =>
  import("@/app/pages/SwapFaceGenerationPage/SwapFaceGenerationPage").then(m => ({ default: m.SwapFaceGenerationPage }))
);
const VirtualReshootGenerationPage = lazy(() =>
  import("@/app/pages/VirtualReshootGenerationPage/VirtualReshootGenerationPage").then(m => ({ default: m.VirtualReshootGenerationPage }))
);
const FailedJobsPage = lazy(() =>
  import("@/app/pages/FailedJobsPage/FailedJobsPage").then(m => ({ default: m.FailedJobsPage }))
);
const SettingsPage = lazy(() =>
  import("@/app/pages/SettingsPage/SettingsPage").then(m => ({ default: m.SettingsPage }))
);

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Preloader />
    </div>
  );
}

const legacyRedirectPaths = [
  "/dashboard",
  "/image-generation",
  "/video-generation",
  "/avatar-generation",
  "/bulk-generation",
  "/swap-face",
  "/virtual-reshoot",
  "/failed-jobs",
  "/settings",
];

function LegacyRouteRedirect() {
  const location = useLocation();
  return (
    <Navigate
      to={`/${defaultLanguage}${location.pathname}${location.search}${location.hash}`}
      replace
    />
  );
}

const MARKETING_PATHS = new Set(["/", "/pricing", "/features", "/contact"]);
const PROTECTED_PATHS = [
  "/image-generation",
  "/video-generation",
  "/avatar-generation",
  "/bulk-generation",
  "/swap-face",
  "/virtual-reshoot",
  "/failed-jobs",
  "/settings",
];

function LanguageLayout({
  isAuthenticated,
  user,
  showLanding,
  isSidebarOpen,
  isLoginModalOpen,
  onMenuOpen,
  onSidebarClose,
  onLoginModalOpen,
  onLoginModalClose,
  onLogin,
  onLogout,
  onGetStarted,
}) {
  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const appConfig = useAppConfig();
  const validatedLang = validateLanguage(lang);
  const normalizedPath = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    if (segments.length <= 1) {
      return "/";
    }

    return `/${segments.slice(1).join("/")}`;
  }, [location.pathname]);

  const isMarketingRoute = MARKETING_PATHS.has(normalizedPath);
  const isProtectedRoute = PROTECTED_PATHS.some((path) =>
    normalizedPath === path || normalizedPath.startsWith(`${path}/`),
  );

  const hideSidebar = normalizedPath === "/virtual-reshoot";

  useEffect(() => {
    if (isAuthenticated || !isProtectedRoute || isLoginModalOpen) {
      return;
    }
    // Store the intended protected route so we can redirect after login
    try {
      const intended = `${location.pathname}${location.search}${location.hash}`;
      window.sessionStorage.setItem("intendedRoute", intended);
    } catch {
      // ignore storage errors
    }
    onLoginModalOpen?.();
  }, [isAuthenticated, isProtectedRoute, isLoginModalOpen, onLoginModalOpen]);

  if (lang !== validatedLang) {
    const segments = location.pathname.split("/").filter(Boolean);
    const pathWithoutLanguage = segments.length > 1 ? `/${segments.slice(1).join("/")}` : "";

    return (
      <Navigate
        to={`/${validatedLang}${pathWithoutLanguage}${location.search}${location.hash}`}
        replace
      />
    );
  }
  // After a successful login, redirect back to the last intended protected route if any
  useEffect(() => {
    if (!isAuthenticated) return;
    try {
      const stored = window.sessionStorage.getItem("intendedRoute");
      if (stored) {
        window.sessionStorage.removeItem("intendedRoute");
        const current = `${location.pathname}${location.search}${location.hash}`;
        if (stored !== current) {
          navigate(stored, { replace: true });
        }
      }
    } catch {
      // ignore storage errors
    }
  }, [isAuthenticated, location.pathname, location.search, location.hash, navigate]);

  return (
    <SmoothScrollWrapper>
      <DynamicIslandNav
        onMenuClick={hideSidebar ? undefined : onMenuOpen}
        onLoginClick={onLoginModalOpen}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={onLogout}
        isLandingPage={showLanding && !isAuthenticated}
        currentLanguage={appConfig.language}
      />
      {hideSidebar ? null : (
        <ModernSidebar
          isOpen={isSidebarOpen}
          onClose={onSidebarClose}
          isLandingPage={showLanding && !isAuthenticated}
          isAuthenticated={isAuthenticated}
          onLoginRequest={onLoginModalOpen}
          currentLanguage={appConfig.language}
        />
      )}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={onLoginModalClose}
        onLogin={onLogin}
      />

      {isMarketingRoute && showLanding && !isAuthenticated ? (
        <LandingPage
          onGetStarted={onGetStarted}
          onLogin={onLoginModalOpen}
        />
      ) : (
        <div className="min-h-screen bg-background">
          <div className="pt-24">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route index element={<CollapsibleDashboard />} />
                <Route path="dashboard" element={<CollapsibleDashboard />} />
                <Route path="image-generation" element={<ImageGenerationPage />} />
                <Route path="video-generation" element={<VideoGenerationPage />} />
                <Route path="avatar-generation" element={<AvatarGenerationPage />} />
                <Route path="bulk-generation" element={<BulkGenerationPage />} />
                <Route path="swap-face" element={<SwapFaceGenerationPage />} />
                <Route path="virtual-reshoot" element={<VirtualReshootGenerationPage />} />
                <Route path="failed-jobs" element={<FailedJobsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to={`/${appConfig.language}`} replace />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      )}
      <Toaster />
    </SmoothScrollWrapper>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // Restore auth session from storage
    try {
      const stored = window.localStorage.getItem("aiStudioUser");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.username) {
          setUser(parsed);
          setIsAuthenticated(true);
          setShowLanding(false);
        }
      }
    } catch {
      // ignore storage errors
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (userData) => {
    console.log("User logged in:", userData);
    const normalizedUser = {
      username: userData.username,
      rememberMe: Boolean(userData.rememberMe),
    };
    setUser(normalizedUser);
    setIsAuthenticated(true);
    setShowLanding(false);
    setIsLoginModalOpen(false);

    try {
      if (normalizedUser.rememberMe) {
        window.localStorage.setItem("aiStudioUser", JSON.stringify(normalizedUser));
      } else {
        window.localStorage.removeItem("aiStudioUser");
      }
    } catch {
      // ignore storage errors
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setShowLanding(true);
    try {
      window.localStorage.removeItem("aiStudioUser");
      window.sessionStorage.removeItem("intendedRoute");
    } catch {
      // ignore storage errors
    }

    // After logout, always send the user back to the landing page
    // and clear any module/query parameters (e.g. ?module=swap-face).
    try {
      window.location.href = `/${defaultLanguage}`;
    } catch {
      // fallback: do nothing if navigation fails
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setShowLanding(false);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/${defaultLanguage}`} replace />} />
        {legacyRedirectPaths.map((path) => (
          <Route key={path} path={path} element={<LegacyRouteRedirect />} />
        ))}
        <Route
          path="/:lang/*"
          element={(
            <LanguageLayout
              isAuthenticated={isAuthenticated}
              user={user}
              showLanding={showLanding}
              isSidebarOpen={isSidebarOpen}
              isLoginModalOpen={isLoginModalOpen}
              onMenuOpen={() => setIsSidebarOpen(true)}
              onSidebarClose={() => setIsSidebarOpen(false)}
              onLoginModalOpen={() => setIsLoginModalOpen(true)}
              onLoginModalClose={() => setIsLoginModalOpen(false)}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onGetStarted={handleGetStarted}
            />
          )}
        />
        <Route path="*" element={<LegacyRouteRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;













