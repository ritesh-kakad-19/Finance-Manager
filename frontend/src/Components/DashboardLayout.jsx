import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import FinanceNavbar from "./FinanceNavbar";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./theme/ThemeProvider";

const DashboardLayout = ({ children }) => {
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("userToken");
      sessionStorage.clear();
      navigate("/login");
    }, 900);
  };

  return (
    <div className="app-atmosphere min-h-screen text-[var(--text-primary)]">
      <Sidebar
        handleLogout={handleLogout}
        loggingOut={loggingOut}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex min-h-screen flex-col transition-all duration-300 md:pl-[260px]">
        <FinanceNavbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          loggingOut={loggingOut}
          handleLogout={handleLogout}
          setMobileOpen={setMobileOpen}
        />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="page-enter mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
