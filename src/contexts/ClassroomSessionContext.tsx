
import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserRole } from "./UserContext";
import { useUser } from "./UserContext";
import { useLocation } from "./LocationContext";
import { sendNotification, generateSessionAssignmentMessage } from "@/utils/notificationService";
import { toast } from "@/components/ui/use-toast";

export interface SessionAttendee {
  userId: string;
  role: UserRole | "presenter"; // camper, observer, or presenter
  published: boolean; // track if assignment has been published
}

export interface ClassroomSession {
  id: string;
  title: string;
  description: string;
  date: string;
  locationId: string;
  roomName: string; // Changed from roomNumber to roomName for consistency
  maxCampers: number;
  currentCampers: number;
  attendees: SessionAttendee[];
}

interface ClassroomSessionContextType {
  sessions: ClassroomSession[];
  setSessions: React.Dispatch<React.SetStateAction<ClassroomSession[]>>;
  addSession: (session: Omit<ClassroomSession, "id">) => void;
  updateSession: (id: string, sessionData: Partial<ClassroomSession>) => void;
  deleteSession: (id: string) => void;
  getSession: (id: string) => ClassroomSession | undefined;
  getSessionsByLocationId: (locationId: string) => ClassroomSession[];
  getUnpublishedAttendees: () => number;
  publishAttendees: (sessionId: string, attendeeIds: string[]) => void;
  resetAllSessions: () => void;
  isUserAvailableAt: (userId: string, date: string, durationMinutes: number) => boolean;
}

const ClassroomSessionContext = createContext<ClassroomSessionContextType | undefined>(undefined);

// Sample classroom sessions
const sampleSessions: ClassroomSession[] = [
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

export const ClassroomSessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ClassroomSession[]>(sampleSessions);
  const { users } = useUser();
  const { getLocation } = useLocation();

  const addSession = (session: Omit<ClassroomSession, "id">) => {
    const newSession = {
      ...session,
      id: Date.now().toString(),
    };
    setSessions((prev) => [...prev, newSession]);
  };

  const updateSession = (id: string, sessionData: Partial<ClassroomSession>) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id ? { ...session, ...sessionData } : session
      )
    );
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
  };

  const getSession = (id: string) => {
    return sessions.find((session) => session.id === id);
  };

  const getSessionsByLocationId = (locationId: string) => {
    return sessions.filter((session) => session.locationId === locationId);
  };

  const getUnpublishedAttendees = () => {
    return sessions.reduce((count, session) => {
      return count + session.attendees.filter(a => !a.published).length;
    }, 0);
  };

  // Helper function to check if a user is already scheduled at a given time
  const isUserAvailableAt = (userId: string, dateString: string, durationMinutes: number = 60) => {
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

  const publishAttendees = (sessionId: string, attendeeIds: string[]) => {
    const session = getSession(sessionId);
    if (!session) return;
    
    const location = getLocation(session.locationId);
    const locationName = location ? location.name : "Unknown Location";
    
    // Update the attendee status to published
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            attendees: session.attendees.map((attendee) => {
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
            }),
          };
        }
        return session;
      })
    );
    
    // Show a toast notification for admins
    toast({
      title: "Attendees Published",
      description: `${attendeeIds.length} attendee assignments have been published with notifications sent.`
    });
  };

  // Add a method to reset all sessions
  const resetAllSessions = () => {
    setSessions([]);
  };

  return (
    <ClassroomSessionContext.Provider
      value={{
        sessions,
        setSessions,
        addSession,
        updateSession,
        deleteSession,
        getSession,
        getSessionsByLocationId,
        getUnpublishedAttendees,
        publishAttendees,
        resetAllSessions,
        isUserAvailableAt,
      }}
    >
      {children}
    </ClassroomSessionContext.Provider>
  );
};

export const useClassroomSession = () => {
  const context = useContext(ClassroomSessionContext);
  if (context === undefined) {
    throw new Error("useClassroomSession must be used within a ClassroomSessionProvider");
  }
  return context;
};
