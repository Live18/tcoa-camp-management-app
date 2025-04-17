
import React from "react";
import { useLocation as useRouterLocation } from "react-router-dom";
import { PermissionGate } from "@/components/auth/PermissionGate";
import SessionCreateForm from "@/components/admin/session/SessionCreateForm";
import SessionPageHeader from "@/components/admin/session/SessionPageHeader";

const SessionNew = () => {
  const { pathname } = useRouterLocation();
  const isClassroomSession = pathname.includes("classroom-sessions");
  const backPath = isClassroomSession ? "/admin/classroom-sessions" : "/admin/sessions";
  const pageName = isClassroomSession ? "Create Classroom Session" : "Create Session";
  const backLabel = isClassroomSession ? "Classroom Sessions" : "Sessions";
  
  return (
    <PermissionGate 
      action="session.create"
      redirectTo={backPath}
    >
      <div className="container mx-auto py-6">
        <SessionPageHeader 
          title={pageName}
          backPath={backPath}
          backLabel={backLabel}
        />

        <SessionCreateForm 
          backPath={backPath}
          isClassroomSession={isClassroomSession}
        />
      </div>
    </PermissionGate>
  );
};

export default SessionNew;
