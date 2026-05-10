import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { DashboardLayout } from "./layouts/dashboard-layout";
import { CitizenLayout } from "./layouts/CitizenLayout";

import { OfficerOperations } from "./pages/OfficerOperations";
import { GovernanceDashboard } from "./pages/GovernanceDashboard";
import { IntelligenceCenter } from "./pages/IntelligenceCenter";
import { RealTimeMonitoring } from "./pages/RealTimeMonitoring";
import { SuperAdminPanel } from "./pages/SuperAdminPanel";
import { SettingsPage } from "./pages/SettingsPage";
import { ManageCitizens } from "./pages/ManageCitizens";
import { AuthPage } from "./pages/AuthPage";

import { CitizenOverview } from "./pages/citizen-dashboard/CitizenOverviewPage";
import { SubmitGrievance } from "./pages/citizen-dashboard/SubmitGrievancePage";
import { CitizenLeaderboard } from "./pages/citizen-dashboard/LeaderboardPage";
import { CitizenCommunity } from "./pages/citizen-dashboard/CommunityPage";
import { CitizenContact } from "./pages/citizen-dashboard/ContactPage";
import { CitizenProfile } from "./pages/citizen-dashboard/ProfilePage";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/citizen-dashboard" element={<CitizenLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<CitizenOverview />} />
            <Route path="submit" element={<SubmitGrievance />} />
            <Route path="leaderboard" element={<CitizenLeaderboard />} />
            <Route path="community" element={<CitizenCommunity />} />
            <Route path="contact" element={<CitizenContact />} />
            <Route path="profile" element={<CitizenProfile />} />
          </Route>
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
