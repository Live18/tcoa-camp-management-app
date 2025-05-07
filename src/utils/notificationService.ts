
import { sendEmail, generateNotificationEmail, sendSmsNotification } from "./emailService";
import { NotificationPreference } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  notificationPreference?: NotificationPreference;
  [key: string]: any;
}

export interface NotificationOptions {
  title: string;
  message: string;
  user: User;
}

/**
 * Send a notification to a user based on their notification preferences
 */
export const sendNotification = async ({ title, message, user }: NotificationOptions): Promise<boolean> => {
  // If no notification preference is set, don't send anything
  if (!user.notificationPreference) {
    console.log(`User ${user.name} has no notification preferences set. Notification not sent.`);
    return false;
  }

  try {
    // Store notification in database first
    await storeNotification(user.id, title, message);
    
    // Send notification based on user preference
    if (user.notificationPreference === "email" && user.email) {
      const { subject, body } = generateNotificationEmail(title, message);
      return await sendEmail({
        to: user.email,
        subject,
        body
      });
    } else if (user.notificationPreference === "sms" && user.phone) {
      return sendSmsNotification(user.phone, `${title}: ${message}`);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }

  console.log(`Failed to send notification to ${user.name}. Invalid preference or missing contact info.`);
  return false;
};

/**
 * Store a notification in the Supabase database
 * This will be used alongside external notifications (email/SMS)
 */
export const storeNotification = async (
  userId: string,
  title: string,
  message: string,
  type: string = "general"
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        title,
        message,
        type,
        status: "unread"
      });
      
    if (error) {
      console.error("Failed to store notification:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Error storing notification:", err);
    return false;
  }
};

/**
 * Generate assignment notification message for a session
 */
export const generateSessionAssignmentMessage = (
  sessionTitle: string, 
  date: string, 
  location: string,
  role: string
): string => {
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `You have been assigned as a ${role} to the session "${sessionTitle}" at ${location} on ${formattedDate}.`;
};

/**
 * Generate assignment notification message for a game
 */
export const generateGameAssignmentMessage = (
  gameTitle: string, 
  date: string, 
  location: string,
  court: number,
  role: string
): string => {
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `You have been assigned as a ${role} to the game "${gameTitle}" at ${location} (Court ${court}) on ${formattedDate}.`;
};
