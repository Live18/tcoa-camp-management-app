
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMeeting } from "@/contexts/MeetingContext";
import { useUser } from "@/contexts/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const MeetingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMeeting } = useMeeting();
  const { users, currentUser } = useUser();

  const meeting = getMeeting(id || "");

  if (!meeting) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Meeting Not Found</CardTitle>
            <CardDescription>
              The meeting you are looking for does not exist.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/meetings")}>Back to Meetings</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "presenter": return "bg-blue-100 text-blue-800";
      case "evaluator": return "bg-purple-100 text-purple-800";
      case "observer": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
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
    <div className="container mx-auto py-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/meetings")}
        className="mb-4"
      >
        ← Back to Meetings
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{meeting.title}</CardTitle>
              <CardDescription>{meeting.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>{formatDate(meeting.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>{formatTime(meeting.date)}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>{meeting.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>
                    {meeting.currentAttendees} / {meeting.maxAttendees} attendees
                  </span>
                </div>
              </div>
            </CardContent>
            {currentUser?.isAdmin && (
              <CardFooter>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 w-full">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/admin/meetings/edit/${meeting.id}`)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    Send Notification
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Attendees</CardTitle>
              <CardDescription>
                People participating in this meeting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meeting.attendees.map((attendee) => {
                  const user = users.find(u => u.id === attendee.userId);
                  if (!user) return null;

                  return (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={user.photoUrl} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                      <Badge className={getRoleBadgeClass(attendee.role)}>
                        {attendee.role}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            {currentUser?.isAdmin && (
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/admin/meetings/${meeting.id}/attendees`)}
                >
                  Manage Attendees
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetails;
