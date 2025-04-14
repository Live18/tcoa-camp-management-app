
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "@/types/userTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldAlert } from "lucide-react";

interface AdminHeaderProps {
  adminUser: User;
  backPath?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  adminUser,
  backPath = "/admin/manage-admins"
}) => {
  const navigate = useNavigate();
  
  // Function to get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="mb-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate(backPath)}
        className="px-0"
      >
        ← Back to Admin Management
      </Button>
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mt-2">
        <h1 className="text-3xl font-bold">Edit Admin</h1>
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-3">
            <AvatarImage src={adminUser.photoUrl} alt={adminUser.name} />
            <AvatarFallback>{getInitials(adminUser.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{adminUser.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center">
              <ShieldAlert className="h-3 w-3 mr-1" /> Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
