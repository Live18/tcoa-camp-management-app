
import React from "react";
import { useNavigate } from "react-router-dom";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { useLocation } from "@/contexts/LocationContext";
import { usePermission } from "@/contexts/PermissionContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { toast } from "@/components/ui/use-toast";
import SessionForm, { SessionFormValues } from "@/components/admin/session/SessionForm";
import { Button } from "@/components/ui/button";

const SessionNew = () => {
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
      title: "Session created",
      description: `${data.title} has been created successfully.`,
    });
    navigate("/admin/sessions");
  };

  return (
    <PermissionGate 
      action="session.create"
      redirectTo="/admin/sessions"
    >
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin/sessions")}
              className="mb-2 px-0"
            >
              ← Back to Sessions
            </Button>
            <h1 className="text-3xl font-bold">Create Classroom Session</h1>
          </div>
        </div>

        <SessionForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/sessions")}
          submitLabel="Create Session"
          title="Session Information"
          description="Enter the details of the new classroom session"
          isClassroomSession={false}
          defaultValues={{
            title: "",
            description: "",
            date: new Date().toISOString().slice(0, 16),
            locationId: "",
            roomName: "",
            maxCampers: 15,
          }}
        />
      </div>
    </PermissionGate>
  );
};

export default SessionNew;
