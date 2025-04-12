
import React from "react";
import { useNavigate } from "react-router-dom";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { PermissionGate } from "@/components/auth/PermissionGate";

const SessionManagement = () => {
  const navigate = useNavigate();
  const { sessions } = useClassroomSession();

  // Redirect to the ClassroomSessionManagement page
  React.useEffect(() => {
    navigate("/admin/classroom-sessions");
  }, [navigate]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Session Management</h1>
      <p>Redirecting to classroom sessions management...</p>
    </div>
  );
};

export default SessionManagement;
