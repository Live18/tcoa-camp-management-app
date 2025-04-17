
import { ClassroomSession } from "@/types/sessionTypes";
import { sendNotification, generateSessionAssignmentMessage } from "@/utils/notificationService";
import { toast } from "@/components/ui/use-toast";

// Sample classroom sessions - moved from context
export const sampleSessions: ClassroomSession[] = [
  {
    id: "1",
    title: "Basketball Strategy 101",
    description: "Learn the fundamentals of basketball strategy",
    date: "2023-08-10T14:00:00Z",
    locationId: "1",
    roomName: "101", // Changed from roomNumber to roomName
    maxCampers: 15,
    currentCampers: 6,
    attendees: [
      { userId: "1", role: "admin", published: true },
      { userId: "3", role: "camper", published: true },
      { userId: "4", role: "camper", published: false },
      { userId: "5", role: "camper", published: true },
      { userId: "6", role: "presenter", published: true },
      { userId: "7", role: "camper", published: false },
    ],
  },
  {
    id: "2",
    title: "Defensive Techniques",
    description: "Mastering defensive moves and positions",
    date: "2023-08-15T10:30:00Z",
    locationId: "2",
    roomName: "102", // Changed from roomNumber to roomName
    maxCampers: 12,
    currentCampers: 3,
    attendees: [
      { userId: "1", role: "admin", published: true },
      { userId: "2", role: "observer", published: false },
      { userId: "5", role: "camper", published: true },
    ],
  },
];

// Helper function to check if a user is already scheduled at a given time
export const isUserAvailableAt = (
  sessions: ClassroomSession[],
  userId: string, 
  dateString: string, 
  durationMinutes: number = 60
) => {
  const eventTime = new Date(dateString).getTime();
  // Default session duration is 60 minutes
  const eventEndTime = eventTime + (durationMinutes * 60 * 1000);

  // Check all sessions where this user is an attendee
  const userSessions = sessions.filter(session => 
    session.attendees.some(attendee => attendee.userId === userId)
  );

  // Check if any of those sessions overlap with the provided time
  const hasConflict = userSessions.some(session => {
    const sessionTime = new Date(session.date).getTime();
    const sessionEndTime = sessionTime + (durationMinutes * 60 * 1000);
    
    // Check for overlap
    return (
      (eventTime >= sessionTime && eventTime < sessionEndTime) || // Event starts during an existing session
      (eventEndTime > sessionTime && eventEndTime <= sessionEndTime) || // Event ends during an existing session
      (eventTime <= sessionTime && eventEndTime >= sessionEndTime) // Event completely encloses an existing session
    );
  });

  return !hasConflict;
};

// Handle publishing attendees and sending notifications
export const handlePublishAttendees = (
  sessions: ClassroomSession[],
  sessionId: string, 
  attendeeIds: string[],
  users: any[], 
  getLocation: (id: string) => any,
  updateSession: (id: string, sessionData: Partial<ClassroomSession>) => void
) => {
  const session = sessions.find(s => s.id === sessionId);
  if (!session) return;
  
  const location = getLocation(session.locationId);
  const locationName = location ? location.name : "Unknown Location";
  
  // Update the attendee status to published
  const updatedAttendees = session.attendees.map((attendee) => {
    if (attendeeIds.includes(attendee.userId)) {
      // Find the user to send notification
      const user = users.find(u => u.id === attendee.userId);
      if (user) {
        // Generate and send notification based on user preference
        const message = generateSessionAssignmentMessage(
          session.title,
          session.date,
          `${locationName} - ${session.roomName}`,
          attendee.role
        );
        
        const notificationSent = sendNotification({
          title: "New Session Assignment",
          message,
          user
        });
        
        if (notificationSent) {
          console.log(`Notification sent to ${user.name} about session assignment`);
        }
      }
      return { ...attendee, published: true };
    }
    return attendee;
  });
  
  // Update the session with the newly published attendees
  updateSession(sessionId, { attendees: updatedAttendees });
  
  // Show a toast notification for admins
  toast({
    title: "Attendees Published",
    description: `${attendeeIds.length} attendee assignments have been published with notifications sent.`
  });
};
