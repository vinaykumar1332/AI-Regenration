import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
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

function LanguageLayout({
  isAuthenticated,
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
  const appConfig = useAppConfig();
  const validatedLang = validateLanguage(lang);

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

  return (
    <SmoothScrollWrapper>
      <DynamicIslandNav
        onMenuClick={onMenuOpen}
        onLoginClick={onLoginModalOpen}
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        isLandingPage={showLanding && !isAuthenticated}
        currentLanguage={appConfig.language}
      />
      <ModernSidebar
        isOpen={isSidebarOpen}
        onClose={onSidebarClose}
        isLandingPage={showLanding && !isAuthenticated}
        isAuthenticated={isAuthenticated}
        onLoginRequest={onLoginModalOpen}
        currentLanguage={appConfig.language}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={onLoginModalClose}
        onLogin={onLogin}
      />

      {showLanding && !isAuthenticated ? (
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
  const [showLanding, setShowLanding] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (userData) => {
    console.log("User logged in:", userData);
    setIsAuthenticated(true);
    setShowLanding(false);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLanding(true);
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













