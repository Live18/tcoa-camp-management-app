
import React, { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { PlusCircle, Check, X, UserX } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
}

export const AttendeeManager: React.FC<AttendeeManagerProps> = ({
  attendees,
  onAddAttendee,
  onRemoveAttendee,
  onPublishAttendees,
  allowedRoles,
  maxAttendees
}) => {
  const { users } = useUser();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>(allowedRoles[0]);
  
  // Get available users who are not already attendees
  const availableUsers = users.filter(
    (user) => !attendees.some((attendee) => attendee.userId === user.id)
  );
  
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
    toast({
      title: "Attendees Published",
      description: "The attendee assignments have been published",
    });
  };

  const roleLabel = (role: string) => {
    switch (role) {
      case "admin": return { label: "Admin", className: "bg-red-100 text-red-800" };
      case "presenter": return { label: "Presenter", className: "bg-blue-100 text-blue-800" };
      case "observer": return { label: "Observer", className: "bg-green-100 text-green-800" };
      case "camper": return { label: "Camper", className: "bg-gray-100 text-gray-800" };
      default: return { label: role, className: "bg-gray-100 text-gray-800" };
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Attendees</CardTitle>
        <CardDescription>
          Add or remove attendees and publish assignments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {maxAttendees && attendees.filter(a => a.role === "camper").length >= maxAttendees && (
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
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
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
            disabled={!selectedUserId || (maxAttendees && selectedRole === "camper" && attendees.filter(a => a.role === "camper").length >= maxAttendees)}
            className="whitespace-nowrap"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Attendee
          </Button>
        </div>
        
        {attendees.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendeeUsers.map((attendee) => (
                  <TableRow key={attendee.userId}>
                    <TableCell>
                      {attendee.user ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={attendee.user.photoUrl} alt={attendee.user.name} />
                            <AvatarFallback>{getInitials(attendee.user.name)}</AvatarFallback>
                          </Avatar>
                          <span>{attendee.user.name}</span>
                        </div>
                      ) : (
                        <span>Unknown User</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={roleLabel(attendee.role).className}>
                        {roleLabel(attendee.role).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {attendee.published ? (
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                          <Check className="mr-1 h-3 w-3" /> Published
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                          <X className="mr-1 h-3 w-3" /> Unpublished
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveAttendee(attendee.userId)}
                      >
                        <UserX className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="flex justify-end">
              <Button
                variant="default"
                onClick={handlePublishUnpublished}
                disabled={!attendees.some(attendee => !attendee.published)}
              >
                Publish Unpublished Assignments
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <UserX className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="font-medium text-lg">No attendees yet</h3>
            <p className="text-muted-foreground mt-1">
              Add users using the form above
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
