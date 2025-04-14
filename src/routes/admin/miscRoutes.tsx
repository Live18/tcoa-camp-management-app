import React from "react";
import { Route } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageAdmins from "@/pages/admin/ManageAdmins";
import Assignments from "@/pages/admin/Assignments";
import Invitations from "@/pages/admin/Invitations";
import Notifications from "@/pages/admin/Notifications";
import EndCamp from "@/pages/admin/EndCamp";

export const adminMiscRoutes = (
  <>
    {/* Main admin dashboard */}
    <Route
      path="/admin"
      element={
        <AuthGuard requiredRole="admin">
          <AdminDashboard />
        </AuthGuard>
      }
    />

    {/* Other admin routes */}
    <Route
      path="/admin/manage-admins"
      element={
        <AuthGuard requiredRole="admin">
          <ManageAdmins />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/assignments"
      element={
        <AuthGuard requiredRole="admin">
          <Assignments />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/invitations"
      element={
        <AuthGuard requiredRole="admin">
          <Invitations />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/notifications"
      element={
        <AuthGuard requiredRole="admin">
          <Notifications />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/end-camp"
      element={
        <AuthGuard requiredRole="admin">
          <EndCamp />
        </AuthGuard>
      }
    />
  </>
);
