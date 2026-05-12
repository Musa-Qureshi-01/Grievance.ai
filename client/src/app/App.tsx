import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { AdminDashboardLayout } from "./layouts/AdminDashboardLayout";
import { OfficerDashboardLayout } from "./layouts/OfficerDashboardLayout";
import { CitizenLayout } from "./layouts/CitizenLayout";

import { OfficerOperations } from "./pages/officer-dashboard/OperationsPage";
import { OfficerAIWorkspace } from "./pages/officer-dashboard/AIWorkspacePage";
import { OfficerIntelligence } from "./pages/officer-dashboard/IntelligencePage";
import { OfficerLeaderboard } from "./pages/officer-dashboard/LeaderboardPage";
import { OfficerProfile } from "./pages/officer-dashboard/ProfilePage";
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
import { AdminOperations } from "./pages/AdminOperations";

type AppRole = "citizen" | "officer" | "admin" | "super_admin";

const roleHome: Record<AppRole, string> = {
  citizen: "/dashboard",
  officer: "/office",
  admin: "/admin",
  super_admin: "/admin",
};

function normalizeRole(role?: string): AppRole | null {
  const normalized = role?.toLowerCase();
  if (normalized === "student" || normalized === "user") return "citizen";
  if (normalized === "office" || normalized === "staff") return "officer";
  if (normalized === "citizen" || normalized === "officer" || normalized === "admin" || normalized === "super_admin") {
    return normalized;
  }
  return null;
}

function getStoredRole(): AppRole | null {
  try {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return null;
    return normalizeRole(JSON.parse(storedUser).role);
  } catch {
    localStorage.removeItem("currentUser");
    return null;
  }
}

function RequireRole({ allowedRoles, children }: { allowedRoles: AppRole[]; children: JSX.Element }) {
  const location = useLocation();
  const token = localStorage.getItem("authToken");
  const role = getStoredRole();

  if (!token || !role) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={roleHome[role]} replace />;
  }

  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          <Route path="/dashboard" element={<RequireRole allowedRoles={["citizen"]}><CitizenLayout /></RequireRole>}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<CitizenOverview />} />
            <Route path="submit" element={<SubmitGrievance />} />
            <Route path="leaderboard" element={<CitizenLeaderboard />} />
            <Route path="community" element={<CitizenCommunity />} />
            <Route path="contact" element={<CitizenContact />} />
            <Route path="profile" element={<CitizenProfile />} />
          </Route>

          <Route path="/citizen-dashboard" element={<RequireRole allowedRoles={["citizen"]}><CitizenLayout /></RequireRole>}>
            <Route index element={<Navigate to="/dashboard/overview" replace />} />
            <Route path="overview" element={<CitizenOverview />} />
            <Route path="submit" element={<SubmitGrievance />} />
            <Route path="leaderboard" element={<CitizenLeaderboard />} />
            <Route path="community" element={<CitizenCommunity />} />
            <Route path="contact" element={<CitizenContact />} />
            <Route path="profile" element={<CitizenProfile />} />
          </Route>

          <Route path="/admin" element={<RequireRole allowedRoles={["admin", "super_admin"]}><AdminDashboardLayout /></RequireRole>}>
            <Route index element={<Navigate to="operations" replace />} />
            <Route path="operations" element={<AdminOperations />} />
            <Route path="governance" element={<GovernanceDashboard />} />
            <Route path="citizens" element={<ManageCitizens />} />
            <Route path="intelligence" element={<IntelligenceCenter />} />
            <Route path="monitoring" element={<RealTimeMonitoring />} />
            <Route path="admin" element={<SuperAdminPanel />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Add other dashboard routes here as they are created */}
          </Route>

          <Route path="/admin-dashboard" element={<RequireRole allowedRoles={["admin", "super_admin"]}><AdminDashboardLayout /></RequireRole>}>
            <Route index element={<Navigate to="/admin/operations" replace />} />
            <Route path="operations" element={<AdminOperations />} />
            <Route path="governance" element={<GovernanceDashboard />} />
            <Route path="citizens" element={<ManageCitizens />} />
            <Route path="intelligence" element={<IntelligenceCenter />} />
            <Route path="monitoring" element={<RealTimeMonitoring />} />
            <Route path="admin" element={<SuperAdminPanel />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="/office" element={<RequireRole allowedRoles={["officer"]}><OfficerDashboardLayout /></RequireRole>}>
            <Route index element={<Navigate to="operations" replace />} />
            <Route path="operations" element={<OfficerOperations />} />
            <Route path="ai-workspace" element={<OfficerAIWorkspace />} />
            <Route path="intelligence" element={<OfficerIntelligence />} />
            <Route path="leaderboard" element={<OfficerLeaderboard />} />
            <Route path="profile" element={<OfficerProfile />} />
          </Route>

          <Route path="/officer-dashboard" element={<RequireRole allowedRoles={["officer"]}><OfficerDashboardLayout /></RequireRole>}>
            <Route index element={<Navigate to="/office/operations" replace />} />
            <Route path="operations" element={<OfficerOperations />} />
            <Route path="ai-workspace" element={<OfficerAIWorkspace />} />
            <Route path="intelligence" element={<OfficerIntelligence />} />
            <Route path="leaderboard" element={<OfficerLeaderboard />} />
            <Route path="profile" element={<OfficerProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
