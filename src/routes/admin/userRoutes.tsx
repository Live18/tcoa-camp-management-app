
import React from "react";
import { Route } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import UserManagement from "@/pages/admin/UserManagement";
import UserDetail from "@/pages/admin/UserDetail";
import UserEdit from "@/pages/admin/UserEdit";
import AdminEdit from "@/pages/admin/AdminEdit";

export const adminUserRoutes = (
  <>
    <Route
      path="/admin/users"
      element={
        <AuthGuard requiredRole="admin">
          <UserManagement />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/users/edit/:id"
      element={
        <AuthGuard requiredRole="admin">
          <UserEdit />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/users/:id"
      element={
        <AuthGuard requiredRole="admin">
          <UserDetail />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/manage-admins/edit/:id"
      element={
        <AuthGuard requiredRole="admin">
          <AdminEdit />
        </AuthGuard>
      }
    />
  </>
);
