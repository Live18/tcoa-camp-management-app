
import React, { createContext, useContext, ReactNode } from "react";
import { useUser, UserRole } from "@/contexts/UserContext";

// Define permission types
export type PermissionAction = 
  // User management permissions
  | "user.view"
  | "user.create"
  | "user.edit"
  | "user.delete"
  
  // Meeting permissions
  | "meeting.view"
  | "meeting.create"
  | "meeting.edit"
  | "meeting.delete"
  | "meeting.manage_attendees"
  
  // Document permissions
  | "document.view"
  | "document.upload"
  | "document.delete"
  
  // Notification permissions
  | "notification.send"
  
  // Invitation permissions
  | "invitation.send"
  
  // Branding permissions
  | "branding.edit";

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
    "meeting.view", "meeting.create", "meeting.edit", "meeting.delete", "meeting.manage_attendees",
    "document.view", "document.upload", "document.delete",
    "notification.send",
    "invitation.send",
    "branding.edit"
  ],
  presenter: [
    // Presenters can view users, view/edit their meetings, view documents
    "user.view",
    "meeting.view", "meeting.edit",
    "document.view"
  ],
  evaluator: [
    // Evaluators can view users, view meetings, view documents
    "user.view",
    "meeting.view",
    "document.view"
  ],
  observer: [
    // Observers can only view meetings and documents
    "meeting.view",
    "document.view"
  ],
  attendee: [
    // Regular attendees can only view meetings they're part of
    "meeting.view",
    "document.view"
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
