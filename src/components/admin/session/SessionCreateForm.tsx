
import React from "react";
import { useNavigate } from "react-router-dom";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { toast } from "@/components/ui/use-toast";
import SessionForm, { SessionFormValues } from "@/components/admin/session/SessionForm";

interface SessionCreateFormProps {
  backPath: string;
  isClassroomSession?: boolean;
}

const SessionCreateForm: React.FC<SessionCreateFormProps> = ({ 
  backPath, 
  isClassroomSession = false 
}) => {
  const navigate = useNavigate();
  const { addSession } = useClassroomSession();
  
  const handleSubmit = (data: SessionFormValues) => {
    // Create a session object
    const newSession = {
      title: data.title,
      description: data.description,
      date: data.date,
      locationId: data.locationId,
      roomName: data.roomName,
      maxCampers: data.maxCampers,
      currentCampers: 0,
      attendees: [],
    };
    
    addSession(newSession);
    toast({
      title: `${isClassroomSession ? "Classroom session" : "Session"} created`,
      description: `${data.title} has been created successfully.`,
    });
    navigate(backPath);
  };

  return (
    <SessionForm
      onSubmit={handleSubmit}
      onCancel={() => navigate(backPath)}
      submitLabel="Create Session"
      title="Session Information"
      description="Enter the details of the new session"
      isClassroomSession={isClassroomSession}
      defaultValues={{
        title: "",
        description: "",
        date: new Date().toISOString().slice(0, 16),
        locationId: "",
        roomName: "",
        maxCampers: 15,
      }}
    />
  );
};

export default SessionCreateForm;
