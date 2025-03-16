
import React from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";
import { BottomNav } from "./BottomNav";

export const MobileLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 p-4 overflow-auto pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
