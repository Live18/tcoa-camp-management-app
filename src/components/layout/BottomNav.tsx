
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, User, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePermission } from "@/contexts/PermissionContext";

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { can } = usePermission();

  const navItems = [
    {
      label: "Home",
      icon: Home,
      path: "/",
    },
    {
      label: "Profile",
      icon: User,
      path: "/profile",
    },
    {
      label: "Meetings",
      icon: Calendar,
      path: "/meetings",
    },
  ];

  // Add admin section for users who can view the admin dashboard
  // This now includes admins, presenters, and observers
  if (can("user.view")) {
    navItems.push({
      label: "Admin",
      icon: Settings,
      path: "/admin",
    });
  }

  return (
    <div className="md:hidden fixed bottom-0 w-full border-t bg-background z-10">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={cn(
              "flex flex-col items-center justify-center w-full py-2",
              location.pathname === item.path
                ? "text-primary"
                : "text-muted-foreground"
            )}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
