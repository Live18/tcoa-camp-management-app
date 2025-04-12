import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { PermissionProvider } from "@/contexts/PermissionContext";
import { GameProvider } from "@/contexts/GameContext";
import { ClassroomSessionProvider } from "@/contexts/ClassroomSessionContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Login } from "@/pages/Login";
import Register from "@/pages/Register";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Games from "@/pages/Games";
import ClassroomSessions from "@/pages/ClassroomSessions";
import GameDetails from "@/pages/GameDetails";
import ClassroomSessionDetails from "@/pages/ClassroomSessionDetails";
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
import ManageAdmins from "@/pages/admin/ManageAdmins";
import Assignments from "@/pages/admin/Assignments";
import Invitations from "@/pages/admin/Invitations";
import Notifications from "@/pages/admin/Notifications";
import EndCamp from "@/pages/admin/EndCamp";

// Import ClassroomSessionManagement component
import ClassroomSessionManagement from "@/pages/admin/ClassroomSessionManagement";

function App() {
  return (
    <UserProvider>
      <PermissionProvider>
        <LocationProvider>
          <GameProvider>
            <ClassroomSessionProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
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
                  {/* Add the missing routes for Games and ClassroomSessions */}
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
                  {/* Admin routes */}
                  <Route
                    path="/admin"
                    element={
                      <AuthGuard requiredRole="admin">
                        <AdminDashboard />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <AuthGuard requiredRole="admin">
                        <UserManagement />
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
                    path="/admin/users/edit/:id"
                    element={
                      <AuthGuard requiredRole="admin">
                        <UserEdit />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/admin/locations"
                    element={
                      <AuthGuard requiredRole="admin">
                        <LocationManagement />
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
                    path="/admin/locations/edit/:id"
                    element={
                      <AuthGuard requiredRole="admin">
                        <LocationEdit />
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
                    path="/admin/games"
                    element={
                      <AuthGuard requiredRole="admin">
                        <GameManagement />
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
                  <Route
                    path="/admin/games/edit/:id"
                    element={
                      <AuthGuard requiredRole="admin">
                        <GameEdit />
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
                    path="/admin/sessions"
                    element={
                      <AuthGuard requiredRole="admin">
                        <SessionManagement />
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
                    path="/admin/sessions/edit/:id"
                    element={
                      <AuthGuard requiredRole="admin">
                        <SessionEdit />
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
                  {/* Add the End Camp route */}
                  <Route
                    path="/admin/end-camp"
                    element={
                      <AuthGuard requiredRole="admin">
                        <EndCamp />
                      </AuthGuard>
                    }
                  />
                  {/* Add the classroom sessions routes */}
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
                </Routes>
              </Router>
            </ClassroomSessionProvider>
          </GameProvider>
        </LocationProvider>
      </PermissionProvider>
    </UserProvider>
  );
}

export default App;
