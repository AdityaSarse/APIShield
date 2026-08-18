import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";

import DashboardLayout from "../layouts/DashboardLayout";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import DashboardPage from "../features/dashboard/dashboard.page";
import AnalyticsPage from "../features/analytics/analytics.page";
import AdvancedAnalyticsPage from "../features/advanced-analytics/advanced-analytics.page";
import ApiKeysPage from "../features/api-keys/apiKeys.page";
import ServicesPage from "../features/services/services.page";
import RateLimitingPage from "../features/rate-limiting/rateLimiting.page";
import AlgorithmsPage from "../features/algorithms/algorithms.page";
import TrafficPage from "../features/traffic/traffic.page";
import MonitoringPage from "../features/monitoring/monitoring.page";
import SettingsPage from "../features/settings/settings.page";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          
          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/api-keys" element={<ApiKeysPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/advanced-analytics" element={<AdvancedAnalyticsPage />} />
            <Route path="/rate-limiting" element={<RateLimitingPage />} />
            <Route path="/algorithms" element={<AlgorithmsPage />} />
            <Route path="/traffic" element={<TrafficPage />} />
            <Route path="/system-health" element={<MonitoringPage />} />
            <Route path="/alerts" element={<MonitoringPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

        </Route>
      </Route>

      {/* Error Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/404" element={<NotFound />} />

      {/* Default */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default AppRoutes;
