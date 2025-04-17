
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { toast } from "@/components/ui/use-toast";
import { ClassroomSession } from "@/types/sessionTypes";
import SessionForm, { SessionFormValues } from "@/components/admin/session/SessionForm";

interface ClassroomSessionEditFormProps {
  session: ClassroomSession;
  backPath: string;
}

const ClassroomSessionEditForm: React.FC<ClassroomSessionEditFormProps> = ({ session, backPath }) => {
  const navigate = useNavigate();
  const { updateSession } = useClassroomSession();
  const [defaultValues, setDefaultValues] = useState<SessionFormValues | null>(null);

  useEffect(() => {
    // Format the date to match the datetime-local input format (YYYY-MM-DDThh:mm)
    const dateObj = new Date(session.date);
    const formattedDate = dateObj.toISOString().slice(0, 16);
    
    setDefaultValues({
      title: session.title,
      description: session.description,
      date: formattedDate,
      locationId: session.locationId,
      roomName: session.roomName,
      maxCampers: session.maxCampers,
    });
  }, [session]);
  
  const handleSubmit = (data: SessionFormValues) => {
    updateSession(session.id, {
      title: data.title,
      description: data.description,
      date: data.date,
      locationId: data.locationId,
      roomName: data.roomName,
      maxCampers: data.maxCampers,
    });
    
    toast({
      title: "Session updated",
      description: `${data.title} has been updated successfully.`,
    });
    
    navigate(backPath);
  };

  if (!defaultValues) {
    return <div>Loading form values...</div>;
  }

  return (
    <SessionForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      onCancel={() => navigate(backPath)}
      submitLabel="Save Changes"
      title="Session Information"
      description={`Edit the details of "${session.title}"`}
      isClassroomSession={true}
    />
  );
};

export default ClassroomSessionEditForm;
