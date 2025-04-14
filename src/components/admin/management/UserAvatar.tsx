
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldAlert } from "lucide-react";

interface UserAvatarProps {
  name: string;
  photoUrl?: string;
  showAdminBadge?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name, 
  photoUrl, 
  showAdminBadge = true 
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex items-center">
      <Avatar className="h-8 w-8 mr-2">
        <AvatarImage src={photoUrl} alt={name} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">{name}</div>
        {showAdminBadge && (
          <div className="text-xs text-muted-foreground flex items-center">
            <ShieldAlert className="h-3 w-3 mr-1" /> Admin
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAvatar;
