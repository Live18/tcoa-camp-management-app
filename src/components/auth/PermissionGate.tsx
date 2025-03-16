
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { usePermission, PermissionAction } from "@/contexts/PermissionContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PermissionGateProps {
  children: ReactNode;
  action: PermissionAction | PermissionAction[];
  fallback?: ReactNode;
  redirectTo?: string;
  requireAll?: boolean;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  action,
  fallback,
  redirectTo,
  requireAll = false,
}) => {
  const { can, canAll, canAny } = usePermission();
  
  // Handle array of permissions
  const hasPermission = Array.isArray(action)
    ? requireAll ? canAll(action) : canAny(action)
    : can(action);
  
  if (hasPermission) {
    return <>{children}</>;
  }
  
  // Handle redirect
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Show fallback UI if provided
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Default access denied message
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Denied</CardTitle>
        <CardDescription>
          You don't have permission to access this resource.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </CardContent>
    </Card>
  );
};
