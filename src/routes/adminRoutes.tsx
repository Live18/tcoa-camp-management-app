
import React from "react";
import { adminUserRoutes } from "./admin/userRoutes";
import { adminLocationRoutes } from "./admin/locationRoutes";
import { adminGameRoutes } from "./admin/gameRoutes";
import { adminSessionRoutes } from "./admin/sessionRoutes";
import { adminMiscRoutes } from "./admin/miscRoutes";

// Combining all admin routes from separate files
export const adminRoutes = (
  <>
    {/* Misc routes including dashboard */}
    {adminMiscRoutes}
    
    {/* User management routes */}
    {adminUserRoutes}
    
    {/* Location management routes */}
    {adminLocationRoutes}
    
    {/* Game management routes */}
    {adminGameRoutes}
    
    {/* Session management routes */}
    {adminSessionRoutes}
  </>
);
