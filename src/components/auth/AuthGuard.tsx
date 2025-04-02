
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { MobileLayout } from "@/components/layout/MobileLayout";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin";
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { currentUser } = useUser();

  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
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
