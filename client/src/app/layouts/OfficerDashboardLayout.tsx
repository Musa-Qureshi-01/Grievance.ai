import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { OfficerSidebar } from "../components/layout/OfficerSidebar";
import { OfficerTopNav } from "../components/layout/OfficerTopNav";
import { RightContextPanel } from "../components/layout/RightContextPanel";
import { OfficerLayoutWrapper } from "../components/layout/OfficerLayoutWrapper";
import { useSidebarState } from "../hooks/useSidebarState";

export function OfficerDashboardLayout() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isCollapsed, setIsCollapsed } = useSidebarState();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1020] flex transition-colors duration-300">
      <OfficerSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <OfficerTopNav
          onOpenMobile={() => setIsMobileMenuOpen(true)}
          onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          theme={theme}
        />

        <OfficerLayoutWrapper
          main={
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Outlet />
            </motion.div>
          }
          aside={<RightContextPanel />}
        />
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
