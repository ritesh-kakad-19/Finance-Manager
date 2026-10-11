import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./Components/LandingPage";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import UserProfile from "./Components/UserProfile";
import ForgotPassword from "./Components/ForgotPassword";
import DashboardLayout from "./Components/DashboardLayout";
import Dashboard from "./Components/Dashboard";
import TransactionsPage from "./Components/TransactionsPage";
import AnalyticsPage from "./Components/AnalyticsPage";
import SettingsPage from "./Components/SettingsPage";
import { ThemeProvider } from "./Components/theme/ThemeProvider";
import { ToastProvider } from "./Components/ui/toast";

const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider> 
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/home" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="/transactions" element={<DashboardLayout><TransactionsPage /></DashboardLayout>} />
            <Route path="/analytics" element={<DashboardLayout><AnalyticsPage /></DashboardLayout>} />
            <Route path="/profile" element={<DashboardLayout><UserProfile /></DashboardLayout>} />
            <Route path="/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
