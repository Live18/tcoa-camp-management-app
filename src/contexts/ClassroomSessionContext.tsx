
import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserRole } from "./UserContext";

export interface SessionAttendee {
  userId: string;
  role: UserRole; // camper or presenter
  published: boolean; // track if assignment has been published
}

export interface ClassroomSession {
  id: string;
  title: string;
  description: string;
  date: string;
  locationId: string;
  roomName: string;
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
}

const ClassroomSessionContext = createContext<ClassroomSessionContextType | undefined>(undefined);

// Sample classroom sessions
const sampleSessions: ClassroomSession[] = [
  {
    id: "1",
    title: "Basketball Strategy",
    description: "Learn advanced basketball strategies",
    date: "2023-07-16T09:00:00Z",
    locationId: "1",
    roomName: "Lecture Hall A",
    maxCampers: 30,
    currentCampers: 15,
    attendees: [
      { userId: "1", role: "admin", published: true },
      { userId: "2", role: "presenter", published: true },
      { userId: "3", role: "camper", published: true },
    ],
  },
  {
    id: "2",
    title: "Nutrition for Athletes",
    description: "Proper nutrition for optimal performance",
    date: "2023-07-21T13:00:00Z",
    locationId: "2",
    roomName: "Conference Room B",
    maxCampers: 20,
    currentCampers: 8,
    attendees: [
      { userId: "1", role: "admin", published: true },
      { userId: "2", role: "presenter", published: true },
      { userId: "3", role: "camper", published: false },
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
