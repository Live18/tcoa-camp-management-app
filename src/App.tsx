
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { MeetingProvider } from "./contexts/MeetingContext";
import { PermissionProvider } from "./contexts/PermissionContext";
import { MobileLayout } from "./components/layout/MobileLayout";

// Pages
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Meetings from "./pages/Meetings";
import MeetingDetails from "./pages/MeetingDetails";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <PermissionProvider>
          <MeetingProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<MobileLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/meetings" element={<Meetings />} />
                  <Route path="/meetings/:id" element={<MeetingDetails />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </MeetingProvider>
        </PermissionProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
