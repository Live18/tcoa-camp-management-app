import React from "react";
import { Route } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UserManagement from "@/pages/admin/UserManagement";
import UserDetail from "@/pages/admin/UserDetail";
import UserEdit from "@/pages/admin/UserEdit";
import LocationManagement from "@/pages/admin/LocationManagement";
import LocationDetail from "@/pages/admin/LocationDetail";
import LocationEdit from "@/pages/admin/LocationEdit";
import LocationCreate from "@/pages/admin/LocationCreate";
import GameManagement from "@/pages/admin/GameManagement";
import GameDetail from "@/pages/admin/GameDetail";
import GameEdit from "@/pages/admin/GameEdit";
import GameNew from "@/pages/admin/GameNew";
import SessionManagement from "@/pages/admin/SessionManagement";
import SessionDetail from "@/pages/admin/SessionDetail";
import SessionEdit from "@/pages/admin/SessionEdit";
import SessionNew from "@/pages/admin/SessionNew";
import ClassroomSessionManagement from "@/pages/admin/ClassroomSessionManagement";
import ManageAdmins from "@/pages/admin/ManageAdmins";
import Assignments from "@/pages/admin/Assignments";
import Invitations from "@/pages/admin/Invitations";
import Notifications from "@/pages/admin/Notifications";
import EndCamp from "@/pages/admin/EndCamp";

// We need to ensure the admin routes are in the right order to avoid route conflicts
export const adminRoutes = (
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
    
    {/* User management routes */}
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
    
    {/* Location management routes */}
    <Route
      path="/admin/locations"
      element={
        <AuthGuard requiredRole="admin">
          <LocationManagement />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/locations/new"
      element={
        <AuthGuard requiredRole="admin">
          <LocationCreate />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/locations/edit/:id"
      element={
        <AuthGuard requiredRole="admin">
          <LocationEdit />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/locations/:id"
      element={
        <AuthGuard requiredRole="admin">
          <LocationDetail />
        </AuthGuard>
      }
    />
    
    {/* Game management routes */}
    <Route
      path="/admin/games"
      element={
        <AuthGuard requiredRole="admin">
          <GameManagement />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/games/new"
      element={
        <AuthGuard requiredRole="admin">
          <GameNew />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/games/edit/:id"
      element={
        <AuthGuard requiredRole="admin">
          <GameEdit />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/games/:id"
      element={
        <AuthGuard requiredRole="admin">
          <GameDetail />
        </AuthGuard>
      }
    />
    
    {/* Session/Classroom session management routes - important to maintain order */}
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
