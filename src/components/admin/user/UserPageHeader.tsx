
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PermissionGate } from "@/components/auth/PermissionGate";

interface UserPageHeaderProps {
  title: string;
  onBackClick: () => void;
}

const UserPageHeader: React.FC<UserPageHeaderProps> = ({ 
  title,
  onBackClick
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
      <div>
        <Button 
          variant="ghost" 
          onClick={onBackClick}
          className="mb-2 px-0"
        >
          ← Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      <PermissionGate action="invitation.send">
        <div className="flex mt-4 md:mt-0">
          <Button onClick={() => navigate("/admin/invitations")}>
            Send Invitations
          </Button>
        </div>
      </PermissionGate>
    </div>
  );
};

export default UserPageHeader;
