
import React from "react";
import { useNavigate } from "react-router-dom";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { Button } from "@/components/ui/button";
import ClassroomSessionCreateForm from "@/components/admin/session/ClassroomSessionCreateForm";

const ClassroomSessionCreate = () => {
  const navigate = useNavigate();
  const backPath = "/admin/classroom-sessions";
  
  return (
    <PermissionGate 
      action="session.create"
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
            <h1 className="text-3xl font-bold">Add Classroom Session</h1>
          </div>
        </div>

        <ClassroomSessionCreateForm backPath={backPath} />
      </div>
    </PermissionGate>
  );
};

export default ClassroomSessionCreate;
