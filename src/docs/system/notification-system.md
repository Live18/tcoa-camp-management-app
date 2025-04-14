
# Notification System Architecture

## Overview

The notification system is designed to keep users informed about relevant events across the platform. It supports multiple delivery channels and respects user preferences for how they wish to receive notifications.

## Components and Services

- `notificationService.ts`: Primary service handling notification delivery
- `emailService.ts`: Service for sending email notifications
- `smsService.ts`: Service for sending SMS notifications
- `Toaster.tsx`: Component for displaying in-app toast notifications

## Notification Types

The system supports several types of notifications:

### Admin Status Changes
- Super Admin status granted
- Super Admin status revoked
- Super Admin status transferred
- Admin privileges granted
- Admin privileges revoked

### Assignment Notifications
- User assigned to a game
- User removed from a game
- User assigned to a session
- User removed from a session

### System Announcements
- General announcements from administrators
- Camp-wide updates and notices

## Notification Channels

The system supports multiple notification channels:

### Email Notifications
Email notifications are sent via the `sendGmailEmail` function in `emailService.ts`. This function currently opens a composed email in the user's Gmail account as a simple integration method.

Sample implementation:
```typescript
export const sendGmailEmail = ({ to, subject, body, from }: EmailOptions): boolean => {
  try {
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    return true;
  } catch (error) {
    console.error("Error opening email client:", error);
    return false;
  }
};
```

### SMS Notifications
SMS notifications are sent via the `sendSmsNotification` function in `notificationService.ts`. This is currently a mock implementation that would be replaced with a real SMS service like Twilio in a production environment.

### In-App Toasts
In-app notifications are displayed using the toast component from `@/components/ui/use-toast`. These provide immediate feedback about actions within the application.

Example usage:
```typescript
import { toast } from "@/components/ui/use-toast";

toast({
  title: "Success",
  description: "Your action was completed successfully.",
});
```

## User Notification Preferences

Users can set their notification preferences in their profile:

- **Email**: Notifications sent to the user's email address
- **SMS**: Notifications sent to the user's phone number
- **None**: No notifications sent

The system respects these preferences when sending notifications.

## Notification Service Implementation

The main notification service provides a unified interface for sending notifications through any channel:

```typescript
export const sendNotification = ({ title, message, user }: NotificationOptions): boolean => {
  // If no notification preference is set, don't send anything
  if (!user.notificationPreference) {
    return false;
  }

  // Send notification based on user preference
  if (user.notificationPreference === "email" && user.email) {
    const { subject, body } = generateNotificationEmail(title, message);
    return sendGmailEmail({
      to: user.email,
      subject,
      body
    });
  } else if (user.notificationPreference === "sms" && user.phone) {
    return sendSmsNotification(user.phone, `${title}: ${message}`);
  }

  return false;
};
```

## Helper Functions

The system includes helper functions for generating notification content:

### Email Generation
```typescript
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
```

### Message Generation
```typescript
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
```

## Best Practices

1. **Respect User Preferences**
   - Always check user notification preferences before sending
   - Don't send notifications to users who have opted out

2. **Provide Meaningful Content**
   - Make notification titles descriptive
   - Include all necessary information in the body
   - Use formatting to improve readability

3. **Limit Notification Frequency**
   - Avoid sending too many notifications
   - Bundle related notifications when possible
   - Consider time zones when sending notifications

4. **Error Handling**
   - Log notification delivery failures
   - Have fallback mechanisms for critical notifications
   - Don't block user operations waiting for notification delivery
