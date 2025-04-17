
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PermissionAction } from "@/contexts/PermissionContext";

interface ManagementPageHeaderProps {
  title: string;
  createButtonLabel: string;
  createPermission: PermissionAction | PermissionAction[];
  createPath: string;
}

const ManagementPageHeader: React.FC<ManagementPageHeaderProps> = ({
  title,
  createButtonLabel,
  createPermission,
  createPath,
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin")}
          className="px-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <PermissionGate action={createPermission}>
        <Button onClick={() => navigate(createPath)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {createButtonLabel}
        </Button>
      </PermissionGate>
    </div>
  );
};

export default ManagementPageHeader;
