
import React from "react";
import { PermissionGate } from "@/components/auth/PermissionGate";
import SessionCreateForm from "@/components/admin/session/SessionCreateForm";
import SessionPageHeader from "@/components/admin/session/SessionPageHeader";

const ClassroomSessionCreate = () => {
  const backPath = "/admin/classroom-sessions";
  
  return (
    <PermissionGate 
      action="session.create"
      redirectTo={backPath}
    >
      <div className="container mx-auto py-6">
        <SessionPageHeader
          title="Add Classroom Session"
          backPath={backPath}
          backLabel="Classroom Sessions"
        />

        <SessionCreateForm 
          backPath={backPath} 
          isClassroomSession={true}
        />
      </div>
    </PermissionGate>
  );
};

export default ClassroomSessionCreate;
