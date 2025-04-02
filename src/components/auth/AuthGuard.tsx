
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser, UserRole } from "@/contexts/UserContext";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { currentUser } = useUser();

  // If there's no user, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, check for it
  if (requiredRole) {
    // Admin override - admins can access everything
    if (currentUser.isAdmin) {
      return <>{children}</>;
    }
    
    // For non-admins, check if they have the required role
    if (currentUser.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has required role (if specified)
  return <>{children}</>;
};
