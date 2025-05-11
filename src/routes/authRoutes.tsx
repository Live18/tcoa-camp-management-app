
import React from "react";
import { Route, Navigate } from "react-router-dom";
import { Login } from "@/pages/Login";
import Register from "@/pages/Register";
import { useUser } from "@/contexts/UserContext";

// Wrapper component to redirect authenticated users away from auth pages
const RedirectIfAuthenticated = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useUser();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export const authRoutes = (
  <>
    <Route 
      path="/login" 
      element={
        <RedirectIfAuthenticated>
          <Login />
        </RedirectIfAuthenticated>
      } 
    />
    <Route 
      path="/register" 
      element={
        <RedirectIfAuthenticated>
          <Register />
        </RedirectIfAuthenticated>
      } 
    />
  </>
);
