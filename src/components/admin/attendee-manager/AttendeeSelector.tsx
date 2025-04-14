
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusCircle, AlertTriangle } from "lucide-react";

interface AttendeeSelectorProps {
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
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
  const isMaxCampersReached = maxAttendees && currentCamperCount >= maxAttendees;
  
  return (
    <>
      {isMaxCampersReached && (
        <Alert className="bg-amber-50">
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
                availableUsers.map((user) => (
                  <SelectItem 
                    key={user.id} 
                    value={user.id}
                    disabled={!user.available}
                  >
                    {user.name} ({user.role})
                    {!user.available && (
                      <span className="ml-2 text-amber-500">
                        <AlertTriangle className="inline h-3 w-3" /> Time conflict
                      </span>
                    )}
                  </SelectItem>
                ))
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
          disabled={!selectedUserId || (maxAttendees && selectedRole === "camper" && currentCamperCount >= maxAttendees)}
          className="whitespace-nowrap"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Attendee
        </Button>
      </div>
    </>
  );
};
