
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { useLocation } from "@/contexts/LocationContext";
import { usePermission } from "@/contexts/PermissionContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { toast } from "@/components/ui/use-toast";
import SessionForm, { SessionFormValues } from "@/components/admin/session/SessionForm";
import SessionNotFound from "@/components/admin/session/SessionNotFound";
import { Button } from "@/components/ui/button";

const ClassroomSessionEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSession, updateSession } = useClassroomSession();
  const [isLoading, setIsLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState<SessionFormValues | null>(null);
  
  const session = getSession(id || "");
  const backPath = "/admin/classroom-sessions";
  
  useEffect(() => {
    if (session) {
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
    }
    setIsLoading(false);
  }, [session]);
  
  const handleSubmit = (data: SessionFormValues) => {
    if (!session) return;
    
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

  if (isLoading) {
    return <div className="container mx-auto py-6">Loading...</div>;
  }

  if (!session) {
    return <SessionNotFound backPath={backPath} />;
  }

  return (
    <PermissionGate 
      action="session.edit"
      redirectTo={backPath}
    >
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate(backPath)}
              className="mb-2 px-0"
            >
              ← Back to Classroom Sessions
            </Button>
            <h1 className="text-3xl font-bold">Edit Classroom Session</h1>
          </div>
        </div>

        {defaultValues && (
          <SessionForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={() => navigate(backPath)}
            submitLabel="Save Changes"
            title="Session Information"
            description={`Edit the details of "${session.title}"`}
            isClassroomSession={true}
          />
        )}
      </div>
    </PermissionGate>
  );
};

export default ClassroomSessionEdit;
