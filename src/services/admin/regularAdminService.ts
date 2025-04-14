
import { User } from "@/types/userTypes";
import { toast } from "@/components/ui/use-toast";
import { sendNotification } from "@/utils/notificationService";

/**
 * Remove admin privileges from a user
 */
export const removeAdminPrivileges = (
  userId: string,
  currentUser: User | null,
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
): void => {
  if (!currentUser?.isSuperAdmin) {
    throw new Error("Only Super Admins can remove admin privileges");
  }
  
  const targetUser = users.find(u => u.id === userId);
  if (!targetUser) {
    throw new Error("Target user not found");
  }
  
  if (targetUser.isSuperAdmin) {
    throw new Error("Cannot remove admin privileges from a Super Admin. Revoke Super Admin status first.");
  }
  
  // Don't allow removing one's own admin status
  if (userId === currentUser.id) {
    throw new Error("Cannot remove your own admin status");
  }
  
  // Update users list, removing the admin flag
  setUsers(prevUsers =>
    prevUsers.map(u =>
      u.id === userId ? { ...u, isAdmin: false, role: "presenter", isSuperAdmin: false } : u
    )
  );
  
  // Send notification to the demoted admin based on their preference
  if (targetUser.notificationPreference) {
    sendNotification({
      title: "Admin Access Removed",
      message: `Your administrator access to the Basketball Camp platform has been revoked. You now have presenter privileges.`,
      user: targetUser
    });
  }
  
  toast({
    title: "Admin Removed",
    description: `${targetUser.name} is no longer an admin.`,
  });
};

/**
 * Grant admin privileges to a user
 */
export const grantAdminPrivileges = (
  userId: string,
  currentUser: User | null,
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
): void => {
  if (!currentUser?.isSuperAdmin) {
    throw new Error("Only Super Admins can grant admin privileges");
  }
  
  const targetUser = users.find(u => u.id === userId);
  if (!targetUser) {
    throw new Error("Target user not found");
  }
  
  if (targetUser.isAdmin) {
    throw new Error("User already has admin privileges");
  }
  
  // Update users list, adding the admin flag
  setUsers(prevUsers =>
    prevUsers.map(u =>
      u.id === userId ? { ...u, isAdmin: true, role: "admin" } : u
    )
  );
  
  // Send notification to the new admin
  if (targetUser.notificationPreference) {
    sendNotification({
      title: "Admin Access Granted",
      message: `You have been granted administrator access to the Basketball Camp platform.`,
      user: targetUser
    });
  }
  
  toast({
    title: "Admin Added",
    description: `${targetUser.name} is now an admin.`,
  });
};
