
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import ClassroomSessionPageHeader from "@/components/admin/session/ClassroomSessionPageHeader";
import ClassroomSessionEditForm from "@/components/admin/session/ClassroomSessionEditForm";
import SessionNotFound from "@/components/admin/session/SessionNotFound";

const ClassroomSessionEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { getSession } = useClassroomSession();
  const [isLoading, setIsLoading] = useState(true);
  
  const session = getSession(id || "");
  const backPath = "/admin/classroom-sessions";
  
  // Set loading to false after component mounts
  React.useEffect(() => {
    setIsLoading(false);
  }, []);

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
        <ClassroomSessionPageHeader
          title="Edit Classroom Session"
          backPath={backPath}
        />

        <ClassroomSessionEditForm 
          session={session}
          backPath={backPath}
        />
      </div>
    </PermissionGate>
  );
};

export default ClassroomSessionEdit;
