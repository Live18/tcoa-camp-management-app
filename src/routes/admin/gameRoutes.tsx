
import React from "react";
import { Route } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import GameManagement from "@/pages/admin/GameManagement";
import GameDetail from "@/pages/admin/GameDetail";
import GameEdit from "@/pages/admin/GameEdit";
import GameNew from "@/pages/admin/GameNew";

export const adminGameRoutes = (
  <>
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
  </>
);
