import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/app/components/ui/Sonner/sonner";
import { Preloader } from "@/app/components/Preloader/Preloader";
import { AuthPage } from "@/app/pages/AuthPage/AuthPage";
// import { DashboardPage } from "@/app/pages/DashboardPage/DashboardPage";
import { ImageGenerationPage } from "@/app/pages/ImageGenerationPage/ImageGenerationPage";
import { VideoGenerationPage } from "@/app/pages/VideoGenerationPage/VideoGenerationPage";
import { BulkGenerationPage } from "@/app/pages/BulkGenerationPage/BulkGenerationPage";
import { FailedJobsPage } from "@/app/pages/FailedJobsPage/FailedJobsPage";
// import { UsageAnalyticsPage } from "@/app/pages/UsageAnalyticsPage/UsageAnalyticsPage";
import { BillingPage } from "@/app/pages/BillingPage/BillingPage";
import { SettingsPage } from "@/app/pages/SettingsPage/SettingsPage";
import { DashboardLayout } from "@/app/components/DashboardLayout/DashboardLayout";

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
        <Routes>
          {/* <Route path="/" element={<DashboardPage />} /> */}
          <Route path="/" element={<ImageGenerationPage />} />
          <Route path="/image-generation" element={<ImageGenerationPage />} />
          <Route path="/video-generation" element={<VideoGenerationPage />} />
          <Route path="/bulk-generation" element={<BulkGenerationPage />} />
          <Route path="/failed-jobs" element={<FailedJobsPage />} />
          {/* <Route path="/usage-analytics" element={<UsageAnalyticsPage />} /> */}
          {/* <Route path="/billing" element={<BillingPage />} /> */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;













