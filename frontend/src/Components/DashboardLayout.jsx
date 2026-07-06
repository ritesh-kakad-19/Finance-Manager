import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import FinanceNavbar from "./FinanceNavbar";
import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const [loggingOut, setLoggingOut] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.add("dark-mode");
      document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("dark-mode");
      document.documentElement.setAttribute("data-bs-theme", "light");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("userToken");
      sessionStorage.clear();
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar handleLogout={handleLogout} loggingOut={loggingOut} />
      
      <div className="flex flex-col transition-all duration-300 md:pl-64">
        <FinanceNavbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          loggingOut={loggingOut}
          handleLogout={handleLogout}
        />
        <main className="flex-1 px-4 py-8 md:px-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
