
import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserRole } from "./UserContext";

interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxAttendees: number;
  currentAttendees: number;
  attendees: {
    userId: string;
    role: UserRole;
  }[];
}

interface MeetingContextType {
  meetings: Meeting[];
  setMeetings: React.Dispatch<React.SetStateAction<Meeting[]>>;
  addMeeting: (meeting: Omit<Meeting, "id">) => void;
  updateMeeting: (id: string, meetingData: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  getMeeting: (id: string) => Meeting | undefined;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

// Sample meetings
const sampleMeetings: Meeting[] = [
  {
    id: "1",
    title: "Quarterly Team Meeting",
    description: "Review of Q2 performance and planning for Q3",
    date: "2023-07-15T10:00:00Z",
    location: "Main Conference Room",
    maxAttendees: 25,
    currentAttendees: 18,
    attendees: [
      { userId: "1", role: "admin" },
      { userId: "2", role: "presenter" },
      { userId: "3", role: "camper" },
    ],
  },
  {
    id: "2",
    title: "Product Launch Strategy",
    description: "Planning for the new product line launch",
    date: "2023-07-20T14:30:00Z",
    location: "Innovation Lab",
    maxAttendees: 15,
    currentAttendees: 8,
    attendees: [
      { userId: "1", role: "admin" },
      { userId: "3", role: "camper" },
    ],
  },
];

export const MeetingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [meetings, setMeetings] = useState<Meeting[]>(sampleMeetings);

  const addMeeting = (meeting: Omit<Meeting, "id">) => {
    const newMeeting = {
      ...meeting,
      id: Date.now().toString(),
    };
    setMeetings((prev) => [...prev, newMeeting]);
  };

  const updateMeeting = (id: string, meetingData: Partial<Meeting>) => {
    setMeetings((prev) =>
      prev.map((meeting) =>
        meeting.id === id ? { ...meeting, ...meetingData } : meeting
      )
    );
  };

  const deleteMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((meeting) => meeting.id !== id));
  };

  const getMeeting = (id: string) => {
    return meetings.find((meeting) => meeting.id === id);
  };

  return (
    <MeetingContext.Provider
      value={{
        meetings,
        setMeetings,
        addMeeting,
        updateMeeting,
        deleteMeeting,
        getMeeting,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (context === undefined) {
    throw new Error("useMeeting must be used within a MeetingProvider");
  }
  return context;
};
