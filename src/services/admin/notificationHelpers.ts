
import { toast } from "@/components/ui/use-toast";
import { sendNotification } from "@/utils/notificationService";
import { User } from "@/types/userTypes";

/**
 * Helper to notify users about changes to their admin status
 */
export const notifySuperAdminChange = (
  action: 'grant' | 'revoke' | 'transfer',
  targetUser: User,
  currentUser: User | null
) => {
  if (action === 'grant' && targetUser?.notificationPreference) {
    sendNotification({
      title: "Super Admin Status Granted",
      message: "You have been granted Super Administrator status. You now have full control over all admin privileges and can manage other admins.",
      user: targetUser
    });
    
    toast({
      title: "Success",
      description: `${targetUser?.name} is now a Super Admin.`,
    });
  } else if (action === 'revoke' && targetUser?.notificationPreference) {
    sendNotification({
      title: "Super Admin Status Revoked",
      message: "Your Super Administrator status has been revoked. You still retain regular administrator privileges.",
      user: targetUser
    });
    
    toast({
      title: "Super Admin Revoked",
      description: `${targetUser?.name} is no longer a Super Admin.`,
    });
  } else if (action === 'transfer') {
    // Notify the new super admin
    if (targetUser?.notificationPreference) {
      sendNotification({
        title: "Super Admin Status Transferred",
        message: "You have been granted Super Administrator status. This gives you full control over all admin privileges and management.",
        user: targetUser
      });
    }
    
    // Notify the previous super admin
    if (currentUser?.notificationPreference && currentUser?.id !== targetUser.id) {
      sendNotification({
        title: "Super Admin Status Transferred",
        message: "Your Super Administrator status has been transferred. You now have regular administrator privileges.",
        user: currentUser
      });
    }
    
    toast({
      title: "Super Admin Transferred",
      description: `Super Admin privileges have been transferred to ${targetUser?.name}.`,
    });
  }
};
