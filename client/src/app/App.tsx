import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { LandingPage } from "./pages/landing";
import { DashboardLayout } from "./layouts/dashboard-layout";
import { OfficerOperations } from "./pages/officer-operations";
import { GovernanceDashboard } from "./pages/governance-dashboard";
import { IntelligenceCenter } from "./pages/intelligence-center";
import { RealTimeMonitoring } from "./pages/real-time-monitoring";
import { SuperAdminPanel } from "./pages/super-admin";
import { SettingsPage } from "./pages/settings";
import { ManageCitizens } from "./pages/manage-citizens";
import { AuthPage } from "./pages/auth";
import { CitizenDashboard } from "./pages/citizen-dashboard";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="operations" replace />} />
            <Route path="operations" element={<OfficerOperations />} />
            <Route path="governance" element={<GovernanceDashboard />} />
            <Route path="citizens" element={<ManageCitizens />} />
            <Route path="intelligence" element={<IntelligenceCenter />} />
            <Route path="monitoring" element={<RealTimeMonitoring />} />
            <Route path="admin" element={<SuperAdminPanel />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Add other dashboard routes here as they are created */}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
