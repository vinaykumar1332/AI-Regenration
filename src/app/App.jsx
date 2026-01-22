import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/app/components/ui/Sonner/sonner";
import { Preloader } from "@/app/components/Preloader/Preloader";
import { AuthPage } from "@/app/pages/AuthPage/AuthPage";
import { DashboardLayout } from "@/app/components/DashboardLayout/DashboardLayout";

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

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <Preloader />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <AuthPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <BrowserRouter>
      <DashboardLayout onLogout={handleLogout}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<ImageGenerationPage />} />
            <Route path="/image-generation" element={<ImageGenerationPage />} />
            <Route path="/video-generation" element={<VideoGenerationPage />} />
            <Route path="/avatar-generation" element={<AvatarGenerationPage />} />
            <Route path="/bulk-generation" element={<BulkGenerationPage />} />
            <Route path="/failed-jobs" element={<FailedJobsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;













