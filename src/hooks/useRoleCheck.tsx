
import { useUser, UserRole } from "@/contexts/UserContext";

type RoleCheckResult = {
  isAdmin: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  roleIs: (role: UserRole) => boolean;
};

export const useRoleCheck = (): RoleCheckResult => {
  const { currentUser } = useUser();
  
  // Check if user is admin
  const isAdmin = Boolean(currentUser?.isAdmin);
  
  // Check if user has any of the specified roles
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!currentUser) return false;
    
    // Admin override - admins have all roles
    if (currentUser.isAdmin) return true;
    
    // Check if user has the specified role(s)
    if (Array.isArray(roles)) {
      return roles.includes(currentUser.role);
    }
    
    return currentUser.role === roles;
  };
  
  // Check if user's role matches exactly
  const roleIs = (role: UserRole): boolean => {
    if (!currentUser) return false;
    return currentUser.role === role;
  };
  
  return {
    isAdmin,
    hasRole,
    roleIs,
  };
};
