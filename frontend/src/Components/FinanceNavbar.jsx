import React, { useEffect, useState } from "react";
import { Bell, CircleUserRound, LogOut, Menu, Moon, Settings, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAuthHeaders } from "@/lib/finance";
import Logo from "./brand/Logo";

const FinanceNavbar = ({ darkMode, setDarkMode, loggingOut, handleLogout, setMobileOpen }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/profile`, {
        headers: getAuthHeaders(token),
      })
      .then(({ data }) => setUserName(data.name || ""))
      .catch(() => {});
  }, []);

  const initials = userName
    ? userName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("")
    : "";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border-primary)] bg-[var(--bg-header)] px-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setMobileOpen && setMobileOpen((prev) => !prev)}
          className="icon-btn"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Logo size="sm" />
      </div>

      <div className="hidden flex-1 md:block" />

      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="icon-btn"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="icon-btn relative" aria-label="Notifications" title="Notifications">
              <Bell className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-72 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card-solid)] p-1 text-[var(--text-primary)] shadow-xl"
          >
            <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-[#A7B1C5]">
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[var(--border-primary)]" />
            <div className="px-3 py-6 text-center text-sm text-[#6F7B91]">
              You&apos;re all caught up.
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="icon-btn" aria-label="Open profile menu">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-transparent text-xs font-semibold text-[#A7B1C5]">
                  {initials || <CircleUserRound className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card-solid)] p-1 text-[var(--text-primary)] shadow-xl"
          >
            <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-[#A7B1C5]">
              {userName || "My Account"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[var(--border-primary)]" />
            <DropdownMenuItem
              onClick={() => navigate("/profile")}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm focus:bg-white/[0.04]"
            >
              <CircleUserRound className="h-4 w-4 text-[#16D9FF]" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/settings")}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm focus:bg-white/[0.04]"
            >
              <Settings className="h-4 w-4 text-[#16D9FF]" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[var(--border-primary)]" />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={loggingOut}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm text-[#FF4545] focus:bg-[#FF4545]/10"
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? "Logging Out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default FinanceNavbar;
