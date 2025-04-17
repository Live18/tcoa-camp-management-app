
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ClassroomSession, ClassroomSessionContextType } from "@/types/sessionTypes";
import { useUser } from "./UserContext";
import { useLocation } from "./LocationContext";
import { sampleSessions, isUserAvailableAt as checkUserAvailability, handlePublishAttendees } from "@/utils/sessionUtils";

// Create the context
const ClassroomSessionContext = createContext<ClassroomSessionContextType | undefined>(undefined);

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

  // Wrapper for the utility function
  const isUserAvailableAt = (userId: string, dateString: string, durationMinutes: number = 60) => {
    return checkUserAvailability(sessions, userId, dateString, durationMinutes);
  };

  // Wrapper for the publish attendees utility
  const publishAttendees = (sessionId: string, attendeeIds: string[]) => {
    handlePublishAttendees(sessions, sessionId, attendeeIds, users, getLocation, updateSession);
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

// Re-export types for convenience
export type { ClassroomSession, SessionAttendee } from "@/types/sessionTypes";
