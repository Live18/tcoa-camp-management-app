
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { GameProvider } from "./contexts/GameContext";
import { ClassroomSessionProvider } from "./contexts/ClassroomSessionContext";
import { LocationProvider } from "./contexts/LocationContext";
import { PermissionProvider } from "./contexts/PermissionContext";
import { MobileLayout } from "./components/layout/MobileLayout";

// Pages
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Games from "./pages/Games";
import GameDetails from "./pages/GameDetails";
import ClassroomSessions from "./pages/ClassroomSessions";
import ClassroomSessionDetails from "./pages/ClassroomSessionDetails";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import UserDetail from "./pages/admin/UserDetail";
import UserEdit from "./pages/admin/UserEdit";
import LocationManagement from "./pages/admin/LocationManagement";
import LocationCreate from "./pages/admin/LocationCreate";
import LocationEdit from "./pages/admin/LocationEdit";
import LocationDetails from "./pages/admin/LocationDetails";
import LocationGames from "./pages/admin/LocationGames";
import LocationSessions from "./pages/admin/LocationSessions";
import GameManagement from "./pages/admin/GameManagement";
import GameCreate from "./pages/admin/GameCreate";
import GameEdit from "./pages/admin/GameEdit";
import ClassroomSessionManagement from "./pages/admin/ClassroomSessionManagement";
import ClassroomSessionCreate from "./pages/admin/ClassroomSessionCreate";
import ClassroomSessionEdit from "./pages/admin/ClassroomSessionEdit";
import AdminManagement from "./pages/admin/AdminManagement";
import AdminCreate from "./pages/admin/AdminCreate";
import AdminEdit from "./pages/admin/AdminEdit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <PermissionProvider>
          <LocationProvider>
            <GameProvider>
              <ClassroomSessionProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route element={<MobileLayout />}>
                      <Route path="/" element={<Index />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/games" element={<Games />} />
                      <Route path="/games/:id" element={<GameDetails />} />
                      <Route path="/classroom-sessions" element={<ClassroomSessions />} />
                      <Route path="/classroom-sessions/:id" element={<ClassroomSessionDetails />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/users" element={<UserManagement />} />
                      <Route path="/admin/users/:id" element={<UserDetail />} />
                      <Route path="/admin/users/edit/:id" element={<UserEdit />} />
                      <Route path="/admin/locations" element={<LocationManagement />} />
                      <Route path="/admin/locations/new" element={<LocationCreate />} />
                      <Route path="/admin/locations/:id" element={<LocationDetails />} />
                      <Route path="/admin/locations/edit/:id" element={<LocationEdit />} />
                      <Route path="/admin/locations/:id/games" element={<LocationGames />} />
                      <Route path="/admin/locations/:id/sessions" element={<LocationSessions />} />
                      
                      {/* Game Management Routes */}
                      <Route path="/admin/games" element={<GameManagement />} />
                      <Route path="/admin/games/new" element={<GameCreate />} />
                      <Route path="/admin/games/edit/:id" element={<GameEdit />} />
                      
                      {/* Classroom Session Management Routes */}
                      <Route path="/admin/classroom-sessions" element={<ClassroomSessionManagement />} />
                      <Route path="/admin/classroom-sessions/new" element={<ClassroomSessionCreate />} />
                      <Route path="/admin/classroom-sessions/edit/:id" element={<ClassroomSessionEdit />} />
                      
                      {/* Admin Management Routes */}
                      <Route path="/admin/manage-admins" element={<AdminManagement />} />
                      <Route path="/admin/manage-admins/new" element={<AdminCreate />} />
                      <Route path="/admin/manage-admins/edit/:id" element={<AdminEdit />} />
                      
                      {/* Redirect Routes */}
                      <Route path="/admin/sessions" element={<Navigate to="/admin/classroom-sessions" replace />} />
                      <Route path="/admin/sessions/*" element={<Navigate to="/admin/classroom-sessions" replace />} />
                      
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </ClassroomSessionProvider>
            </GameProvider>
          </LocationProvider>
        </PermissionProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
