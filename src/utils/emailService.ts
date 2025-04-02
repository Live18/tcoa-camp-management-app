
type EmailOptions = {
  to: string;
  subject: string;
  body: string;
  from?: string;
};

/**
 * Send an email using the Gmail API
 * This function opens a composed email in the user's Gmail account,
 * which is the simplest way to integrate Gmail without requiring
 * complex OAuth2 setup on the client side.
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
 * Generate invitation email content based on role and custom message
 */
export const generateInvitationEmail = (
  email: string,
  role: string,
  customMessage: string
): { subject: string; body: string } => {
  const appBaseUrl = window.location.origin;
  const inviteLink = `${appBaseUrl}/register?email=${encodeURIComponent(email)}&role=${role}`;
  
  const subject = `You're invited to join the Basketball Camp as a ${role}`;
  
  const body = `
Hello,

You've been invited to join our Basketball Camp platform as a ${role}.

${customMessage ? `\n${customMessage}\n\n` : ''}

To accept this invitation, please click on the link below:
${inviteLink}

This invitation link will expire in 7 days.

Thank you,
Basketball Camp Administration Team
`;

  return { subject, body };
};
