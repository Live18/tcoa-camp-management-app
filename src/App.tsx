
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { PermissionProvider } from "@/contexts/PermissionContext";
import { GameProvider } from "@/contexts/GameContext";
import { ClassroomSessionProvider } from "@/contexts/ClassroomSessionContext";
import { LocationProvider } from "@/contexts/LocationContext";

// Import route groups
import { authRoutes } from "@/routes/authRoutes";
import { userRoutes } from "@/routes/userRoutes";
import { adminRoutes } from "@/routes/adminRoutes";

function App() {
  return (
    <UserProvider>
      <PermissionProvider>
        <LocationProvider>
          <GameProvider>
            <ClassroomSessionProvider>
              <Router>
                <Routes>
                  {/* Auth routes (public) */}
                  {authRoutes}
                  
                  {/* User routes (protected) */}
                  {userRoutes}
                  
                  {/* Admin routes (protected with admin role) */}
                  {adminRoutes}
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
