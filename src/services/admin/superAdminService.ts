
import { User } from "@/types/userTypes";
import { createAdminTransferLog } from "./logService";
import { notifySuperAdminChange } from "./notificationHelpers";

/**
 * Transfer Super Admin status to another admin
 */
export const transferSuperAdminStatus = (
  toUserId: string,
  currentUser: User | null,
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>,
  setAdminTransferLogs: React.Dispatch<React.SetStateAction<AdminTransferLog[]>>
): void => {
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
  createAdminTransferLog(currentUser.id, toUserId, 'super_admin_grant', setAdminTransferLogs);
  
  // Send notifications
  notifySuperAdminChange('transfer', targetUser, currentUser);
};

/**
 * Grant Super Admin status (allows multiple Super Admins)
 */
export const grantSuperAdminStatus = (
  userId: string,
  currentUser: User | null,
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  setAdminTransferLogs: React.Dispatch<React.SetStateAction<AdminTransferLog[]>>
): void => {
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
  createAdminTransferLog(currentUser.id, userId, 'super_admin_grant', setAdminTransferLogs);
  
  // Send notifications
  notifySuperAdminChange('grant', targetUser, currentUser);
};

/**
 * Revoke Super Admin status
 */
export const revokeSuperAdminStatus = (
  userId: string,
  currentUser: User | null,
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  setAdminTransferLogs: React.Dispatch<React.SetStateAction<AdminTransferLog[]>>
): void => {
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
  createAdminTransferLog(currentUser.id, userId, 'super_admin_revoke', setAdminTransferLogs);
  
  // Send notifications
  notifySuperAdminChange('revoke', targetUser, currentUser);
};
