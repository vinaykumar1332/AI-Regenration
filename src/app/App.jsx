import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/app/components/ui/Sonner/sonner";
import { Preloader } from "@/app/components/Preloader/Preloader";
import { LandingPage } from "@/app/pages/LandingPage/LandingPage";
import { DynamicIslandNav } from "@/app/components/DynamicIslandNav/DynamicIslandNav";
import { ModernSidebar } from "@/app/components/ModernSidebar/ModernSidebar";
import { LoginModal } from "@/app/components/LoginModal/LoginModal";
import { CollapsibleDashboard } from "@/app/pages/DashboardPage/CollapsibleDashboard";
import { SmoothScrollWrapper } from "@/app/components/SmoothScrollWrapper/SmoothScrollWrapper";

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
      <SmoothScrollWrapper>
        <DynamicIslandNav
          onMenuClick={() => setIsSidebarOpen(true)}
          onLoginClick={() => setIsLoginModalOpen(true)}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          isLandingPage={showLanding && !isAuthenticated}
        />
        <ModernSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isLandingPage={showLanding && !isAuthenticated}
          isAuthenticated={isAuthenticated}
          onLoginRequest={() => setIsLoginModalOpen(true)}
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
        />

        {/* Show landing page for non-authenticated users or when explicitly shown */}
        {showLanding && !isAuthenticated ? (
          <LandingPage
            onGetStarted={handleGetStarted}
            onLogin={() => setIsLoginModalOpen(true)}
          />
        ) : (
          <div className="min-h-screen bg-background">
            {/* Add padding for fixed nav */}
            <div className="pt-24">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<CollapsibleDashboard />} />
                  <Route path="/dashboard" element={<CollapsibleDashboard />} />
                  <Route path="/image-generation" element={<ImageGenerationPage />} />
                  <Route path="/video-generation" element={<VideoGenerationPage />} />
                  <Route path="/avatar-generation" element={<AvatarGenerationPage />} />
                  <Route path="/bulk-generation" element={<BulkGenerationPage />} />
                  <Route path="/failed-jobs" element={<FailedJobsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </div>
          </div>
        )}
        <Toaster />
      </SmoothScrollWrapper>
    </BrowserRouter>
  );
}

export default App;













