import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/app/components/ui/sonner";
import { Preloader } from "@/app/components/Preloader";
import { AuthPage } from "@/app/pages/AuthPage";
import { DashboardPage } from "@/app/pages/DashboardPage";
import { ImageGenerationPage } from "@/app/pages/ImageGenerationPage";
import { VideoGenerationPage } from "@/app/pages/VideoGenerationPage";
import { BulkGenerationPage } from "@/app/pages/BulkGenerationPage";
import { FailedJobsPage } from "@/app/pages/FailedJobsPage";
import { UsageAnalyticsPage } from "@/app/pages/UsageAnalyticsPage";
import { BillingPage } from "@/app/pages/BillingPage";
import { SettingsPage } from "@/app/pages/SettingsPage";
import { DashboardLayout } from "@/app/components/DashboardLayout";

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
          <Route path="/" element={<DashboardPage />} />
          <Route path="/image-generation" element={<ImageGenerationPage />} />
          <Route path="/video-generation" element={<VideoGenerationPage />} />
          <Route path="/bulk-generation" element={<BulkGenerationPage />} />
          <Route path="/failed-jobs" element={<FailedJobsPage />} />
          <Route path="/usage-analytics" element={<UsageAnalyticsPage />} />
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













