
import React, { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AttendeeList } from "./AttendeeList";
import { AttendeeSelector } from "./AttendeeSelector";
import { useAttendeeAvailability } from "./AttendeeAvailabilityUtils";

interface AttendeeManagerProps {
  attendees: Array<{
    userId: string;
    role: string;
    published: boolean;
  }>;
  onAddAttendee: (userId: string, role: string) => void;
  onRemoveAttendee: (userId: string) => void;
  onPublishAttendees: (attendeeIds: string[]) => void;
  allowedRoles: string[];
  maxAttendees?: number;
  eventDate?: string;
}

export const AttendeeManager: React.FC<AttendeeManagerProps> = ({
  attendees,
  onAddAttendee,
  onRemoveAttendee,
  onPublishAttendees,
  allowedRoles,
  maxAttendees,
  eventDate
}) => {
  const { users } = useUser();
  const { checkUserAvailability } = useAttendeeAvailability();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  // Initialise with the first normalised role so the default is never "presenter"
  const firstNormalizedRole = allowedRoles
    .map((r) => (r === "presenter" ? "observer" : r))
    .filter((r, i, arr) => arr.indexOf(r) === i)[0];
  const [selectedRole, setSelectedRole] = useState<string>(firstNormalizedRole ?? allowedRoles[0]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  
  // Update available users whenever attendees or event date changes
  useEffect(() => {
    // Get users who are not already attendees
    const notAttending = users.filter(
      (user) => !attendees.some((attendee) => attendee.userId === user.id)
    );
    
    // If we have an event date, filter by availability
    if (eventDate) {
      const availableAtTime = notAttending.map(user => ({
        ...user,
        available: checkUserAvailability(user.id, eventDate)
      }));
      
      setAvailableUsers(availableAtTime);
    } else {
      // If no date provided, all users not already attending are available
      setAvailableUsers(notAttending.map(user => ({
        ...user,
        available: true
      })));
    }
  }, [attendees, eventDate, users, checkUserAvailability]);
  
  // Get user objects for current attendees
  const attendeeUsers = attendees.map((attendee) => {
    const user = users.find((u) => u.id === attendee.userId);
    return {
      ...attendee,
      user,
    };
  });

  const handleAddAttendee = () => {
    if (!selectedUserId) {
      toast({
        title: "Error",
        description: "Please select a user to add",
        variant: "destructive",
      });
      return;
    }
    
    // Double-check availability if we have an event date
    if (eventDate) {
      const isAvailable = checkUserAvailability(selectedUserId, eventDate);
      
      if (!isAvailable) {
        toast({
          title: "Scheduling Conflict",
          description: "This user is already scheduled for another event at this time.",
          variant: "destructive",
        });
        return;
      }
    }

    onAddAttendee(selectedUserId, selectedRole);
    setSelectedUserId("");
    toast({
      title: "Attendee Added",
      description: `The user has been added as a ${selectedRole}`,
    });
  };

  const handleRemoveAttendee = (userId: string) => {
    onRemoveAttendee(userId);
    toast({
      title: "Attendee Removed",
      description: "The user has been removed from this event",
    });
  };

  const handlePublishUnpublished = () => {
    const unpublishedAttendeeIds = attendees
      .filter(attendee => !attendee.published)
      .map(attendee => attendee.userId);
    
    if (unpublishedAttendeeIds.length === 0) {
      toast({
        title: "No Unpublished Attendees",
        description: "All attendees are already published",
      });
      return;
    }
    
    onPublishAttendees(unpublishedAttendeeIds);
  };

  const roleLabel = (role: string) => {
    switch (role) {
      case "admin": return { label: "Admin", className: "bg-red-100 text-red-800" };
      case "presenter":
      case "observer": return { label: "Presenter/Observer", className: "bg-green-100 text-green-800" };
      case "camper": return { label: "Camper", className: "bg-gray-100 text-gray-800" };
      default: return { label: role, className: "bg-gray-100 text-gray-800" };
    }
  };

  // Merge "presenter" and "observer" into a single "observer" option so the
  // dropdown shows one combined "Presenter/Observer" entry.
  const normalizedRoles = allowedRoles
    .map((r) => (r === "presenter" ? "observer" : r))
    .filter((r, i, arr) => arr.indexOf(r) === i);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };
  
  const currentCamperCount = attendees.filter(a => a.role === "camper").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Attendees</CardTitle>
        <CardDescription>
          Add or remove attendees and publish assignments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AttendeeSelector
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          availableUsers={availableUsers}
          allowedRoles={normalizedRoles}
          maxAttendees={maxAttendees}
          currentCamperCount={currentCamperCount}
          handleAddAttendee={handleAddAttendee}
          roleLabel={roleLabel}
        />
        
        <AttendeeList
          attendees={attendeeUsers}
          roleLabel={roleLabel}
          handleRemoveAttendee={handleRemoveAttendee}
          getInitials={getInitials}
        />
        
        {attendees.length > 0 && (
          <div className="flex justify-end">
            <Button
              variant="default"
              onClick={handlePublishUnpublished}
              disabled={!attendees.some(attendee => !attendee.published)}
            >
              Publish Unpublished Assignments
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendeeManager;
