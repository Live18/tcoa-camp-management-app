
import { User, AdminTransferLog } from "@/types/userTypes";

// Sample users for development
export const sampleUsers: User[] = [
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
export const initialAdminTransferLogs: AdminTransferLog[] = [
  {
    id: "1",
    fromUserId: "system",
    toUserId: "1",
    timestamp: new Date(),
    action: 'super_admin_grant',
    status: 'completed'
  }
];
