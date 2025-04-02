
import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";
import { BottomNav } from "./BottomNav";

interface MobileLayoutProps {
  children?: ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 p-4 overflow-auto pb-16">
        {children || <Outlet />}
      </main>
      <BottomNav />
    </div>
  );
};
