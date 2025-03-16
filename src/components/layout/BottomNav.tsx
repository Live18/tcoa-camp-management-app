
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, User, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    {
      label: "Admin",
      icon: Settings,
      path: "/admin",
    },
  ];

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
