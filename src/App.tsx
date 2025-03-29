
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import LocationManagement from "./pages/admin/LocationManagement";
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
                      <Route path="/admin/locations" element={<LocationManagement />} />
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
