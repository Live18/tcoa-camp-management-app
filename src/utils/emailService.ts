import { supabase } from "@/integrations/supabase/client";

type EmailOptions = {
  to: string;
  subject: string;
  body: string;
  from?: string;
};

/**
 * Send an email using the Gmail API
 * This function opens a composed email in the user's Gmail account,
 * which is the simplest way to integrate without requiring
 * complex OAuth2 setup on the client side.
 * 
 * NOTE: This is a temporary solution until Resend integration is complete
 */
export const sendGmailEmail = ({ to, subject, body, from }: EmailOptions): boolean => {
  try {
    // Create a mailto URL with the email parameters
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // Open the Gmail compose window
    window.open(mailtoLink);
    console.log("Email compose window opened");
    return true;
  } catch (error) {
    console.error("Error opening email client:", error);
    return false;
  }
};

/**
 * Send an email using the Resend API via Supabase Edge Function
 * This is the primary email sending method
 */
export const sendResendEmail = async ({ to, subject, body, from }: EmailOptions): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, body, from }
    });
    
    if (error) {
      console.error("Error calling send-email function:", error);
      return false;
    }
    
    console.log("Email sent successfully via Resend");
    return true;
  } catch (error) {
    console.error("Exception in sendResendEmail:", error);
    return false;
  }
};

/**
 * Send an email using the best available method
 * Tries Resend first, falls back to Gmail mailto if that fails
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // Try to send via Resend first
    const result = await sendResendEmail(options);
    
    if (result) {
      return true;
    }
    
    // Fall back to Gmail mailto if Resend fails
    console.log("Resend email failed, falling back to Gmail mailto");
    return sendGmailEmail(options);
  } catch (error) {
    console.error("Error in sendEmail:", error);
    // Final fallback - try Gmail mailto
    return sendGmailEmail(options);
  }
};

/**
 * Generate invitation email content based on role and custom message
 */
export const generateInvitationEmail = (
  email: string,
  role: string,
  customMessage: string
): { subject: string; body: string } => {
  const appBaseUrl = window.location.origin;
  const inviteLink = `${appBaseUrl}/register?email=${encodeURIComponent(email)}&role=${role}`;
  
  // Format role for display in the email
  const displayRole = role === "presenter-observer" 
    ? "Presenter and Observer" 
    : role.charAt(0).toUpperCase() + role.slice(1);
  
  const subject = `You're invited to join the Basketball Camp as a ${displayRole}`;
  
  const body = `
Hello,

You've been invited to join our Basketball Camp platform as a ${displayRole}.

${customMessage ? `\n${customMessage}\n\n` : ''}

To accept this invitation, please click on the link below:
${inviteLink}

This invitation link will expire in 7 days.

Thank you,
Basketball Camp Administration Team
`;

  return { subject, body };
};

/**
 * Generate notification email content
 */
export const generateNotificationEmail = (
  title: string,
  message: string
): { subject: string; body: string } => {
  const subject = `Basketball Camp Notification: ${title}`;
  
  const body = `
Hello,

${message}

This is an automated notification from the Basketball Camp platform.

Thank you,
Basketball Camp Administration Team
`;

  return { subject, body };
};

/**
 * Send SMS notification (mocked)
 * In a real app, this would integrate with a service like Twilio
 */
export const sendSmsNotification = (
  phone: string,
  message: string
): boolean => {
  // This is a mock function - in a real app this would call a service like Twilio
  console.log(`Sending SMS to ${phone}: ${message}`);
  return true;
};
