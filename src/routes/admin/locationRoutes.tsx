
import React from "react";
import { Route } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import LocationManagement from "@/pages/admin/LocationManagement";
import LocationDetail from "@/pages/admin/LocationDetail";
import LocationEdit from "@/pages/admin/LocationEdit";
import LocationCreate from "@/pages/admin/LocationCreate";
import LocationGames from "@/pages/admin/LocationGames";
import LocationSessions from "@/pages/admin/LocationSessions";

export const adminLocationRoutes = (
  <>
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
    <Route
      path="/admin/locations/:id/games"
      element={
        <AuthGuard requiredRole="admin">
          <LocationGames />
        </AuthGuard>
      }
    />
    <Route
      path="/admin/locations/:id/sessions"
      element={
        <AuthGuard requiredRole="admin">
          <LocationSessions />
        </AuthGuard>
      }
    />
  </>
);
