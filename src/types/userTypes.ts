
// Define user-related types for the application
export type UserRole = "camper" | "observer" | "presenter" | "admin";
export type NotificationPreference = "email" | "sms" | null;

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  bio?: string;
  phone?: string;
  role: UserRole;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
  comments?: string;
  feedback?: string;
  notificationPreference?: NotificationPreference;
}

// Admin transfer logging interface
export interface AdminTransferLog {
  id: string;
  fromUserId: string;
  toUserId: string;
  timestamp: Date;
  action: 'super_admin_grant' | 'super_admin_revoke' | 'admin_grant' | 'admin_revoke';
  status: 'completed';
}
