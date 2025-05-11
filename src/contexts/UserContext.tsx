
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole, NotificationPreference } from "@/types/userTypes";
import { 
  transferSuperAdminStatus as transferSuperAdmin,
  grantSuperAdminStatus as grantSuperAdmin,
  revokeSuperAdminStatus as revokeSuperAdmin,
  AdminTransferLog
} from "@/services/admin";
import { supabase } from "@/integrations/supabase/client";
import { getUserProfile } from "@/services/authService";
import { initialAdminTransferLogs } from "@/data/sampleUsers";

// Context type definition
interface UserContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  logout: () => void;
  loading: boolean;
  transferSuperAdminStatus: (toUserId: string) => void;
  grantSuperAdminStatus: (userId: string) => void;
  revokeSuperAdminStatus: (userId: string) => void;
  adminTransferLogs: AdminTransferLog[];
  setAdminTransferLogs: React.Dispatch<React.SetStateAction<AdminTransferLog[]>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [adminTransferLogs, setAdminTransferLogs] = useState<AdminTransferLog[]>(initialAdminTransferLogs);
  const [loading, setLoading] = useState(true);

  // Initialize the user context with the current authenticated user
  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Set up the auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              const profile = await getUserProfile(session.user.id);
              if (profile) {
                setCurrentUser(profile);
              }
            } else if (event === 'SIGNED_OUT') {
              setCurrentUser(null);
            }
          }
        );

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const profile = await getUserProfile(session.user.id);
          if (profile) {
            setCurrentUser(profile);
          }
        }
        
        // Load all users (for admin purposes)
        await fetchAllUsers();
        
        setLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error setting up auth:", error);
        setLoading(false);
      }
    };
    
    setupAuth();
  }, []);

  // Fetch all users from Supabase
  const fetchAllUsers = async () => {
    try {
      // Only admins should be able to fetch all users due to RLS policies
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
        
      if (error) {
        console.error("Error fetching users:", error);
        return;
      }
      
      if (data) {
        // Convert from database format to our app format
        const formattedUsers: User[] = data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as UserRole,
          isAdmin: user.is_admin,
          isSuperAdmin: user.is_super_admin,
          phone: user.phone || undefined,
          photoUrl: user.photo_url || undefined,
          bio: user.bio || undefined,
          notificationPreference: user.notification_preference as NotificationPreference || null,
        }));
        
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      setCurrentUser(null);
    }
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
      loading,
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
export type { AdminTransferLog } from "@/services/admin";
