
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { UserPlus } from "lucide-react";

const EmptyAdminState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-6">
      <p className="text-muted-foreground">No admin users found</p>
      <PermissionGate action="admin.manage_other_admins">
        <Button onClick={() => navigate("/admin/manage-admins/new")} className="mt-4">
          <UserPlus className="h-4 w-4 mr-2" /> Add Admin
        </Button>
      </PermissionGate>
    </div>
  );
};

export default EmptyAdminState;
