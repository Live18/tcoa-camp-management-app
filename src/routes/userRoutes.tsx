
import React from "react";
import { Route } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import UserProfile from "@/pages/UserProfile";
import Games from "@/pages/Games";
import GameDetails from "@/pages/GameDetails";
import ClassroomSessions from "@/pages/ClassroomSessions";
import ClassroomSessionDetails from "@/pages/ClassroomSessionDetails";

export const userRoutes = (
  <>
    <Route
      path="/"
      element={
        <AuthGuard>
          <Home />
        </AuthGuard>
      }
    />
    <Route
      path="/profile"
      element={
        <AuthGuard>
          <Profile />
        </AuthGuard>
      }
    />
    <Route
      path="/profile/:userId"
      element={
        <AuthGuard>
          <UserProfile />
        </AuthGuard>
      }
    />
    <Route
      path="/games"
      element={
        <AuthGuard>
          <Games />
        </AuthGuard>
      }
    />
    <Route
      path="/games/:id"
      element={
        <AuthGuard>
          <GameDetails />
        </AuthGuard>
      }
    />
    <Route
      path="/classroom-sessions"
      element={
        <AuthGuard>
          <ClassroomSessions />
        </AuthGuard>
      }
    />
    <Route
      path="/classroom-sessions/:id"
      element={
        <AuthGuard>
          <ClassroomSessionDetails />
        </AuthGuard>
      }
    />
  </>
);
