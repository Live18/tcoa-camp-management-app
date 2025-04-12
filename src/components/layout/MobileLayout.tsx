
import React, { ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { NavBar } from "./NavBar";
import { BottomNav } from "./BottomNav";

interface MobileLayoutProps {
  children?: ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Hide bottom navigation on the EndCamp page for better focus
  const isEndCampPage = location.pathname === "/admin/end-camp";
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 p-4 overflow-auto pb-16">
        {children || <Outlet />}
      </main>
      {!isEndCampPage && <BottomNav />}
    </div>
  );
};
