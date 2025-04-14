
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, UserX } from "lucide-react";

type AttendeeListProps = {
  attendees: Array<{
    userId: string;
    role: string;
    published: boolean;
    user?: any;
  }>;
  roleLabel: (role: string) => { label: string; className: string };
  handleRemoveAttendee: (userId: string) => void;
  getInitials: (name: string) => string;
};

export const AttendeeList: React.FC<AttendeeListProps> = ({
  attendees,
  roleLabel,
  handleRemoveAttendee,
  getInitials
}) => {
  if (!attendees || attendees.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <UserX className="h-6 w-6 text-gray-500" />
        </div>
        <h3 className="font-medium text-lg">No attendees yet</h3>
        <p className="text-muted-foreground mt-1">
          Add users using the form above
        </p>
      </div>
    );
  }

  return (
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
        {attendees.map((attendee) => (
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
  );
};
