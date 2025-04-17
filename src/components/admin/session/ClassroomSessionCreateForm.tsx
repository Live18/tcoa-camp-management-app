
import React from "react";
import { useNavigate } from "react-router-dom";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { toast } from "@/components/ui/use-toast";
import SessionForm, { SessionFormValues } from "@/components/admin/session/SessionForm";

interface ClassroomSessionCreateFormProps {
  backPath: string;
}

const ClassroomSessionCreateForm: React.FC<ClassroomSessionCreateFormProps> = ({ backPath }) => {
  const navigate = useNavigate();
  const { addSession } = useClassroomSession();
  
  const handleSubmit = (data: SessionFormValues) => {
    // Create a session object with all required fields
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
      title: "Classroom session created",
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
      description="Enter the details of the new classroom session"
      isClassroomSession={true}
    />
  );
};

export default ClassroomSessionCreateForm;
