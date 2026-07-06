import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart, 
  UserCircle, 
  Settings, 
  LogOut,
  Wallet,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Sidebar = ({ handleLogout, loggingOut }) => {
  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
    { path: "/transactions", icon: ArrowLeftRight, text: "Transactions" },
    { path: "/analytics", icon: PieChart, text: "Analytics" },
    { path: "/profile", icon: UserCircle, text: "Profile" },
    { path: "/settings", icon: Settings, text: "Settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background transition-transform">
      <div className="flex h-full flex-col px-3 py-4">
        {/* Logo Section */}
        <div className="mb-8 flex items-center gap-2 px-4 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Wallet className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">Financely</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                cn(
                  "group flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground"
                )
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("h-5 w-5 transition-colors", "group-hover:text-primary")} />
                <span>{item.text}</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
            </NavLink>
          ))}
        </nav>

        <Separator className="my-4" />

        {/* Footer / Logout */}
        <div className="mt-auto pt-4">
          <Button 
            variant="ghost" 
            className="w-100 justify-start gap-3 rounded-lg px-4 py-6 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">{loggingOut ? "Logging Out..." : "Logout"}</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
