
import { UserRole } from "@/contexts/UserContext";

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

export interface ClassroomSessionContextType {
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
