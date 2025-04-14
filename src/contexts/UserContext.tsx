
import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, AdminTransferLog } from "@/types/userTypes";
import { sampleUsers, initialAdminTransferLogs } from "@/data/sampleUsers";
import { 
  transferSuperAdminStatus as transferSuperAdmin,
  grantSuperAdminStatus as grantSuperAdmin,
  revokeSuperAdminStatus as revokeSuperAdmin
} from "@/services/adminService";

// Context type definition
interface UserContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  logout: () => void;
  transferSuperAdminStatus: (toUserId: string) => void;
  grantSuperAdminStatus: (userId: string) => void;
  revokeSuperAdminStatus: (userId: string) => void;
  adminTransferLogs: AdminTransferLog[];
  setAdminTransferLogs: React.Dispatch<React.SetStateAction<AdminTransferLog[]>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(sampleUsers[0]);
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [adminTransferLogs, setAdminTransferLogs] = useState<AdminTransferLog[]>(initialAdminTransferLogs);

  const logout = () => {
    setCurrentUser(null);
  };

  // Admin operations using the extracted service functions
  const handleTransferSuperAdminStatus = (toUserId: string): void => {
    if (currentUser) {
      transferSuperAdmin(toUserId, currentUser, users, setUsers, setCurrentUser, setAdminTransferLogs);
    }
  };

  const handleGrantSuperAdminStatus = (userId: string): void => {
    if (currentUser) {
      grantSuperAdmin(userId, currentUser, users, setUsers, setAdminTransferLogs);
    }
  };

  const handleRevokeSuperAdminStatus = (userId: string): void => {
    if (currentUser) {
      revokeSuperAdmin(userId, currentUser, users, setUsers, setAdminTransferLogs);
    }
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      users, 
      setUsers, 
      logout,
      transferSuperAdminStatus: handleTransferSuperAdminStatus,
      grantSuperAdminStatus: handleGrantSuperAdminStatus,
      revokeSuperAdminStatus: handleRevokeSuperAdminStatus,
      adminTransferLogs,
      setAdminTransferLogs
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Re-export types
export type { User, UserRole, NotificationPreference } from "@/types/userTypes";
