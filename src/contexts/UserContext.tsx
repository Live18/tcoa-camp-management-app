
import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "camper" | "observer" | "presenter" | "admin";
export type NotificationPreference = "email" | "sms" | null;

interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  bio?: string;
  phone?: string;
  role: UserRole;
  isAdmin: boolean;
  isSuperAdmin?: boolean; // Added Super Admin flag
  comments?: string;
  feedback?: string; // Added feedback field for campers
  notificationPreference?: NotificationPreference;
}

// Added interface for admin transfer logging
interface AdminTransferLog {
  id: string;
  fromUserId: string;
  toUserId: string;
  timestamp: Date;
  action: 'super_admin_grant' | 'super_admin_revoke' | 'admin_grant' | 'admin_revoke';
  status: 'completed';
}

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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Sample users
const sampleUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    photoUrl: "https://i.pravatar.cc/150?img=1",
    bio: "Camp administrator",
    phone: "555-123-4567",
    role: "admin",
    isAdmin: true,
    isSuperAdmin: true, // Mark as Super Admin
    notificationPreference: "email",
  },
  {
    id: "2",
    name: "John Smith",
    email: "john@example.com",
    photoUrl: "https://i.pravatar.cc/150?img=2",
    bio: "Basketball enthusiast",
    phone: "555-987-6543",
    role: "presenter",
    isAdmin: false,
    comments: "Excited to teach basketball fundamentals!",
    notificationPreference: "sms",
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    photoUrl: "https://i.pravatar.cc/150?img=3",
    bio: "First-time camper",
    phone: "555-234-5678",
    role: "camper",
    isAdmin: false,
    feedback: "I'm loving this camp so far! The basketball drills are challenging but fun.",
    notificationPreference: null,
  },
];

// Initial admin transfer logs
const initialAdminTransferLogs: AdminTransferLog[] = [
  {
    id: "1",
    fromUserId: "system",
    toUserId: "1",
    timestamp: new Date(),
    action: 'super_admin_grant',
    status: 'completed'
  }
];

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(sampleUsers[0]);
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [adminTransferLogs, setAdminTransferLogs] = useState<AdminTransferLog[]>(initialAdminTransferLogs);

  const logout = () => {
    setCurrentUser(null);
  };

  // Function to create a log entry
  const createAdminTransferLog = (fromUserId: string, toUserId: string, action: AdminTransferLog['action']) => {
    const newLog: AdminTransferLog = {
      id: Date.now().toString(),
      fromUserId,
      toUserId,
      timestamp: new Date(),
      action,
      status: 'completed'
    };
    
    setAdminTransferLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  // Transfer Super Admin status to another admin (current Super Admin loses status)
  const transferSuperAdminStatus = (toUserId: string) => {
    if (!currentUser?.isSuperAdmin) {
      throw new Error("Only Super Admins can transfer this status");
    }

    const targetUser = users.find(u => u.id === toUserId);
    if (!targetUser) {
      throw new Error("Target user not found");
    }
    
    if (!targetUser.isAdmin) {
      throw new Error("Super Admin status can only be granted to existing admins");
    }

    // Update users array
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === currentUser.id) {
        return { ...user, isSuperAdmin: false };
      }
      if (user.id === toUserId) {
        return { ...user, isSuperAdmin: true };
      }
      return user;
    }));

    // Update current user if they're transferring from themselves
    if (currentUser.id === toUserId) {
      // No change needed as they already have Super Admin
    } else {
      setCurrentUser(prev => prev ? { ...prev, isSuperAdmin: false } : null);
    }

    // Log the transfer
    createAdminTransferLog(currentUser.id, toUserId, 'super_admin_grant');
  };

  // Grant Super Admin status (allows multiple Super Admins)
  const grantSuperAdminStatus = (userId: string) => {
    if (!currentUser?.isSuperAdmin) {
      throw new Error("Only Super Admins can grant this status");
    }

    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) {
      throw new Error("Target user not found");
    }
    
    if (!targetUser.isAdmin) {
      throw new Error("Super Admin status can only be granted to existing admins");
    }

    if (targetUser.isSuperAdmin) {
      throw new Error("User is already a Super Admin");
    }

    // Update users array
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        return { ...user, isSuperAdmin: true };
      }
      return user;
    }));

    // Log the grant
    createAdminTransferLog(currentUser.id, userId, 'super_admin_grant');
  };

  // Revoke Super Admin status
  const revokeSuperAdminStatus = (userId: string) => {
    if (!currentUser?.isSuperAdmin) {
      throw new Error("Only Super Admins can revoke this status");
    }

    // Count Super Admins to prevent removing the last one
    const superAdminCount = users.filter(u => u.isSuperAdmin).length;
    if (superAdminCount <= 1) {
      throw new Error("Cannot remove the last Super Admin");
    }

    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) {
      throw new Error("Target user not found");
    }

    if (!targetUser.isSuperAdmin) {
      throw new Error("User is not a Super Admin");
    }

    // Don't allow revoking one's own Super Admin status
    if (userId === currentUser.id) {
      throw new Error("Cannot revoke your own Super Admin status");
    }

    // Update users array
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        return { ...user, isSuperAdmin: false };
      }
      return user;
    }));

    // Log the revocation
    createAdminTransferLog(currentUser.id, userId, 'super_admin_revoke');
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      users, 
      setUsers, 
      logout,
      transferSuperAdminStatus,
      grantSuperAdminStatus,
      revokeSuperAdminStatus,
      adminTransferLogs
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
