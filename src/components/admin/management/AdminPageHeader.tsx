
import React from "react";
import { useNavigate } from "react-router-dom";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { Button } from "@/components/ui/button";
import { ClipboardList, UserPlus } from "lucide-react";

interface AdminPageHeaderProps {
  onViewLogs: () => void;
  onAddAdmin: () => void;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  onViewLogs,
  onAddAdmin
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
      <div>
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin")}
          className="mb-2 px-0"
        >
          ← Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Admin Management</h1>
        <p className="text-muted-foreground max-w-2xl mt-2">
          Manage administrator access and permissions. Super Admins have exclusive control over admin privileges.
        </p>
      </div>
      
      <div className="space-x-2 mt-4 md:mt-0 flex">
        <Button onClick={onViewLogs} variant="outline">
          <ClipboardList className="h-4 w-4 mr-2" /> View Admin Logs
        </Button>
        <PermissionGate action="admin.manage_other_admins">
          <Button onClick={onAddAdmin}>
            <UserPlus className="h-4 w-4 mr-2" /> Add Admin
          </Button>
        </PermissionGate>
      </div>
    </div>
  );
};

export default AdminPageHeader;
