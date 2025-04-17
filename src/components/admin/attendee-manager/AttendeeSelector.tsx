
import React from 'react';
import { useUser } from "@/contexts/UserContext";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AttendeeSelectorProps {
  selectedUserId: string;
  setSelectedUserId: (userId: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  availableUsers: any[];
  allowedRoles: string[];
  maxAttendees?: number;
  currentCamperCount: number;
  handleAddAttendee: () => void;
  roleLabel: (role: string) => { label: string; className: string };
}

export const AttendeeSelector: React.FC<AttendeeSelectorProps> = ({
  selectedUserId,
  setSelectedUserId,
  selectedRole,
  setSelectedRole,
  availableUsers,
  allowedRoles,
  maxAttendees,
  currentCamperCount,
  handleAddAttendee,
  roleLabel,
}) => {
  const { users } = useUser();
  
  // Filter users who are not eligible for the selected role
  // Campers cannot be assigned as observers or presenters
  const isRoleEligible = (user: any, role: string) => {
    if ((role === "observer" || role === "presenter") && user.role === "camper") {
      return false;
    }
    return true;
  };

  // When role changes, check if the selected user is eligible for the new role
  React.useEffect(() => {
    if (selectedUserId) {
      const user = users.find(u => u.id === selectedUserId);
      if (user && !isRoleEligible(user, selectedRole)) {
        setSelectedUserId(""); // Clear the selection if user isn't eligible for the role
      }
    }
  }, [selectedRole, selectedUserId, users, setSelectedUserId]);

  return (
    <div>
      {maxAttendees && currentCamperCount >= maxAttendees && (
        <Alert className="bg-amber-50 mb-4">
          <AlertDescription>
            Maximum number of campers ({maxAttendees}) has been reached
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <Select
            value={selectedUserId}
            onValueChange={setSelectedUserId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {availableUsers.length === 0 ? (
                <SelectItem value="none" disabled>
                  No available users
                </SelectItem>
              ) : (
                availableUsers.map((user) => {
                  // Check if the user is eligible for the selected role
                  const eligible = isRoleEligible(user, selectedRole);
                  
                  return (
                    <SelectItem 
                      key={user.id} 
                      value={user.id}
                      disabled={!user.available || !eligible}
                    >
                      {user.name} ({user.role})
                      {!user.available && (
                        <span className="ml-2 text-amber-500">
                          <AlertTriangle className="inline h-3 w-3" /> Time conflict
                        </span>
                      )}
                      {!eligible && (
                        <span className="ml-2 text-red-500">
                          <AlertTriangle className="inline h-3 w-3" /> Invalid role assignment
                        </span>
                      )}
                    </SelectItem>
                  );
                })
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select
            value={selectedRole}
            onValueChange={setSelectedRole}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {allowedRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {roleLabel(role).label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleAddAttendee}
          disabled={
            !selectedUserId || 
            (maxAttendees && selectedRole === "camper" && currentCamperCount >= maxAttendees)
          }
          className="whitespace-nowrap"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Attendee
        </Button>
      </div>
    </div>
  );
};

export default AttendeeSelector;
