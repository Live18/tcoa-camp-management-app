
import React from "react";
import { useNavigate } from "react-router-dom";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { usePermission } from "@/contexts/PermissionContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import SessionForm, { SessionFormValues } from "@/components/admin/session/SessionForm";

const ClassroomSessionCreate = () => {
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
    navigate("/admin/classroom-sessions");
  };

  return (
    <PermissionGate 
      action="session.create"
      redirectTo="/admin/classroom-sessions"
    >
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin/classroom-sessions")}
              className="mb-2 px-0"
            >
              ← Back to Classroom Sessions
            </Button>
            <h1 className="text-3xl font-bold">Add Classroom Session</h1>
          </div>
        </div>

        <SessionForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/classroom-sessions")}
          submitLabel="Create Session"
          title="Session Information"
          description="Enter the details of the new classroom session"
          isClassroomSession={true}
        />
      </div>
    </PermissionGate>
  );
};

export default ClassroomSessionCreate;
