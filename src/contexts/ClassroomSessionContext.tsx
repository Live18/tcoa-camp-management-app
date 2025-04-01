import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserRole } from "./UserContext";

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
  resetAllSessions: () => void; // Added method for end camp functionality
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

  const publishAttendees = (sessionId: string, attendeeIds: string[]) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            attendees: session.attendees.map((attendee) => {
              if (attendeeIds.includes(attendee.userId)) {
                return { ...attendee, published: true };
              }
              return attendee;
            }),
          };
        }
        return session;
      })
    );
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
