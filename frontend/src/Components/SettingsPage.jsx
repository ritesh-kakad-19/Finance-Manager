import React, { useState } from "react";
import axios from "axios";
import { Bell, Download, Moon, ShieldCheck, Sun, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useTheme } from "./theme/ThemeProvider";
import { useToast } from "@/components/ui/toast";
import { exportTransactionsCsv, getAuthHeaders } from "@/lib/finance";
import { cn } from "@/lib/utils";

const Toggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={cn(
      "relative h-6 w-11 rounded-full transition-colors",
      checked ? "bg-gradient-to-r from-[#1677FF] to-[#16D9FF]" : "bg-white/10"
    )}
  >
    <span
      className={cn(
        "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
        checked ? "translate-x-5" : "translate-x-0.5"
      )}
    />
  </button>
);

const SettingsPage = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [budgetReminders, setBudgetReminders] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearing, setClearing] = useState(false);

  const exportCsv = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/transactions`, {
        headers: getAuthHeaders(token),
      });
      if (!data.length) {
        toast("No transactions to export", "error");
        return;
      }
      exportTransactionsCsv(data);
      toast("CSV exported");
    } catch (error) {
      toast("Failed to export CSV", "error");
    }
  };

  const clearAllData = async () => {
    setClearing(true);
    try {
      const token = localStorage.getItem("userToken");
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/transactions`, {
        headers: getAuthHeaders(token),
      });
      await Promise.all(
        data.map((tx) =>
          axios.delete(`${import.meta.env.VITE_API_URL}/transactions/${tx._id}`, {
            headers: getAuthHeaders(token),
          })
        )
      );
      setConfirmClear(false);
      toast("All transaction data cleared");
    } catch (error) {
      toast("Failed to clear data", "error");
    } finally {
      setClearing(false);
    }
  };

  const rows = [
    {
      group: "SECURITY",
      items: [
        {
          icon: ShieldCheck,
          title: "Password",
          description: "Reset your password through the secure recovery flow.",
          control: (
            <Button variant="secondary" size="sm" onClick={() => navigate("/forgot-password")}>
              Change
            </Button>
          ),
        },
      ],
    },
    {
      group: "PREFERENCES",
      items: [
        {
          icon: Bell,
          title: "Email Notifications",
          description: "Receive important updates on this device.",
          control: (
            <Toggle
              checked={emailNotifications}
              onChange={setEmailNotifications}
              label="Email notifications"
            />
          ),
        },
        {
          icon: Bell,
          title: "Budget Reminders",
          description: "Keep a local reminder preference for budgeting.",
          control: (
            <Toggle
              checked={budgetReminders}
              onChange={setBudgetReminders}
              label="Budget reminders"
            />
          ),
        },
        {
          icon: darkMode ? Moon : Sun,
          title: "Theme",
          description: darkMode ? "Dark navy workspace is on." : "Light workspace is on.",
          control: <Toggle checked={darkMode} onChange={setDarkMode} label="Dark theme" />,
        },
      ],
    },
    {
      group: "DATA MANAGEMENT",
      items: [
        {
          icon: Download,
          title: "Export CSV",
          description: "Download your actual transaction records.",
          control: (
            <Button variant="secondary" size="sm" onClick={exportCsv}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          ),
        },
        {
          icon: Trash2,
          title: "Clear All Data",
          description: "Permanently delete every transaction from your account.",
          control: (
            <Button variant="danger" size="sm" onClick={() => setConfirmClear(true)}>
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          ),
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[30px] font-bold tracking-tight md:text-[34px]">Settings</h1>
        <p className="mt-1 text-[15px] text-[#A7B1C5]">Manage your account and preferences.</p>
      </div>

      {rows.map((section) => (
        <div key={section.group} className="space-y-3">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#6F7B91]">{section.group}</p>
          <Card className="divide-y divide-white/10 overflow-hidden">
            {section.items.map((item) => (
              <div key={item.title} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-[#16D9FF]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="text-sm text-[#A7B1C5]">{item.description}</p>
                  </div>
                </div>
                {item.control}
              </div>
            ))}
          </Card>
        </div>
      ))}

      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear all data?"
        description="This will delete every transaction using the existing API. This cannot be undone."
      >
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmClear(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={clearAllData} disabled={clearing}>
            {clearing ? "Clearing..." : "Delete everything"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;
