
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin";
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { currentUser, loading } = useUser();
  const location = useLocation();

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If role requirement specified, check if user has required role
  if (requiredRole === "admin" && !currentUser.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized, render the children
  return (
    <MobileLayout>
      {children}
    </MobileLayout>
  );
};
