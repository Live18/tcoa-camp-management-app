
import React, { createContext, useContext, ReactNode } from "react";
import { useUser, UserRole } from "@/contexts/UserContext";

// Define permission types
export type PermissionAction = 
  // User management permissions
  | "user.view"
  | "user.create"
  | "user.edit"
  | "user.delete"
  
  // Location permissions
  | "location.view"
  | "location.create"
  | "location.edit"
  | "location.delete"
  
  // Game permissions
  | "game.view"
  | "game.create"
  | "game.edit"
  | "game.delete"
  | "game.manage_attendees"
  
  // Classroom session permissions
  | "session.view"
  | "session.create"
  | "session.edit"
  | "session.delete"
  | "session.manage_attendees"
  
  // Notification permissions
  | "notification.send"
  
  // Invitation permissions
  | "invitation.send"
  
  // Admin permissions
  | "admin.create"
  | "admin.manage";

// Define the permission context type
interface PermissionContextType {
  can: (action: PermissionAction) => boolean;
  canAny: (actions: PermissionAction[]) => boolean;
  canAll: (actions: PermissionAction[]) => boolean;
}

// Create the context
const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

// Define role-based permissions
const rolePermissions: Record<UserRole, PermissionAction[]> = {
  admin: [
    // Admins can do everything
    "user.view", "user.create", "user.edit", "user.delete",
    "location.view", "location.create", "location.edit", "location.delete",
    "game.view", "game.create", "game.edit", "game.delete", "game.manage_attendees",
    "session.view", "session.create", "session.edit", "session.delete", "session.manage_attendees",
    "notification.send",
    "invitation.send",
    "admin.create", "admin.manage"
  ],
  presenter: [
    // Presenters can view users, manage their sessions
    "user.view",
    "location.view",
    "game.view",
    "session.view", "session.edit",
    "notification.send"
  ],
  observer: [
    // Observers can view games, users
    "user.view",
    "location.view",
    "game.view"
  ],
  camper: [
    // Regular campers can only view games and sessions they're part of
    "game.view",
    "session.view"
  ]
};

export const PermissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useUser();
  
  // Permission check functions
  const can = (action: PermissionAction): boolean => {
    if (!currentUser) return false;
    
    // Admin override - admins can do everything
    if (currentUser.isAdmin) return true;
    
    // Check role-based permissions
    return rolePermissions[currentUser.role].includes(action);
  };
  
  const canAny = (actions: PermissionAction[]): boolean => {
    return actions.some(action => can(action));
  };
  
  const canAll = (actions: PermissionAction[]): boolean => {
    return actions.every(action => can(action));
  };
  
  return (
    <PermissionContext.Provider value={{ can, canAny, canAll }}>
      {children}
    </PermissionContext.Provider>
  );
};

// Custom hook to use permissions
export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error("usePermission must be used within a PermissionProvider");
  }
  return context;
};
