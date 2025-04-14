
import React from "react";
import { Route } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import SessionManagement from "@/pages/admin/SessionManagement";
import SessionDetail from "@/pages/admin/SessionDetail";
import SessionEdit from "@/pages/admin/SessionEdit";
import SessionNew from "@/pages/admin/SessionNew";
import ClassroomSessionManagement from "@/pages/admin/ClassroomSessionManagement";

export const adminSessionRoutes = (
  <>
    {/* Classroom Session management routes - specific routes first */}
    <Route
      path="/admin/classroom-sessions"
      element={
        <AuthGuard requiredRole="admin">
          <ClassroomSessionManagement />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/classroom-sessions/new"
      element={
        <AuthGuard requiredRole="admin">
          <SessionNew />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/classroom-sessions/edit/:id"
      element={
        <AuthGuard requiredRole="admin">
          <SessionEdit />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/classroom-sessions/:id"
      element={
        <AuthGuard requiredRole="admin">
          <SessionDetail />
        </AuthGuard>
      }
    />
    
    {/* General Session management routes */}
    <Route
      path="/admin/sessions"
      element={
        <AuthGuard requiredRole="admin">
          <SessionManagement />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/sessions/new"
      element={
        <AuthGuard requiredRole="admin">
          <SessionNew />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/sessions/edit/:id"
      element={
        <AuthGuard requiredRole="admin">
          <SessionEdit />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/sessions/:id"
      element={
        <AuthGuard requiredRole="admin">
          <SessionDetail />
        </AuthGuard>
      }
    />
  </>
);
