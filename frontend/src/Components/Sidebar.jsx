import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  ChartNoAxesCombined,
  CircleUserRound,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./brand/Logo";

const Sidebar = ({ handleLogout, loggingOut, mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, text: "Dashboard", match: ["/dashboard", "/home"] },
    { path: "/transactions", icon: ArrowLeftRight, text: "Transactions" },
    { path: "/analytics", icon: ChartNoAxesCombined, text: "Analytics" },
    { path: "/profile", icon: CircleUserRound, text: "Profile" },
    { path: "/settings", icon: Settings, text: "Settings" },
  ];

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen && setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-[260px] border-r border-[var(--border-primary)] bg-[var(--bg-sidebar)] backdrop-blur-xl transition-transform duration-300 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col px-4 py-5">
          <div className="mb-8 px-2 py-1">
            <Logo />
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = item.match
                ? item.match.includes(location.pathname)
                : location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  className={cn(
                    "relative flex items-center gap-3 rounded-[10px] px-3.5 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[rgba(22,119,255,0.12)] text-white before:absolute before:bottom-1.5 before:left-0 before:top-1.5 before:w-[3px] before:rounded-r-full before:bg-gradient-to-b before:from-[#1677FF] before:to-[#16D9FF]"
                      : "text-[#A7B1C5] hover:bg-white/[0.04] hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn("h-5 w-5 transition-colors", isActive ? "text-[#16D9FF]" : "text-[#6F7B91]")}
                  />
                  <span>{item.text}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="my-4 h-px w-full bg-[var(--border-primary)]" />

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-[10px] px-3.5 py-3 text-sm font-medium text-[#A7B1C5] transition-all duration-200 hover:bg-[#FF4545]/10 hover:text-[#FF4545] disabled:opacity-50"
          >
            <LogOut className="h-5 w-5" />
            <span>{loggingOut ? "Logging Out..." : "Logout"}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
