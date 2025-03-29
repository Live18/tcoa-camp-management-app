
import React from "react";
import { useNavigate } from "react-router-dom";
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
import { Calendar, Clock, MapPin, Users, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Meetings = () => {
  const navigate = useNavigate();
  const { meetings } = useMeeting();
  const { currentUser, users } = useUser();

  // Sort meetings by date, newest first
  const sortedMeetings = [...meetings].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // For campers, show all meetings. For others, filter based on role
  const userMeetings = currentUser?.role === "camper"
    ? sortedMeetings
    : currentUser?.isAdmin 
      ? sortedMeetings 
      : sortedMeetings.filter(meeting => 
          meeting.attendees.some(attendee => attendee.userId === currentUser?.id)
        );

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

  const getRoleColor = (role: string) => {
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

  const findPresenters = (meeting: any) => {
    return meeting.attendees
      .filter(att => att.role === "presenter")
      .map(att => users.find(u => u.id === att.userId))
      .filter(Boolean);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Meetings</h1>
        {currentUser?.isAdmin && (
          <Button onClick={() => navigate("/admin/meetings/new")}>
            Create Meeting
          </Button>
        )}
      </div>

      {userMeetings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userMeetings.map((meeting) => {
            // Find user's role in this meeting
            const userAttendee = meeting.attendees.find(
              attendee => attendee.userId === currentUser?.id
            );
            const userRole = userAttendee?.role || "camper";
            
            // Get presenters for this meeting
            const presenters = findPresenters(meeting);

            return (
              <Card key={meeting.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{meeting.title}</CardTitle>
                  <CardDescription>{meeting.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{formatDate(meeting.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{formatTime(meeting.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{meeting.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {meeting.currentAttendees} / {meeting.maxAttendees} attendees
                      </span>
                    </div>
                    
                    {/* Show presenters for all users */}
                    {presenters.length > 0 && (
                      <div className="mt-2">
                        <div className="text-sm font-medium mb-1">Presenters:</div>
                        <div className="flex flex-wrap gap-2">
                          {presenters.map(presenter => (
                            <div key={presenter.id} className="flex items-center">
                              <Avatar className="h-6 w-6 mr-1">
                                <AvatarImage src={presenter.photoUrl} alt={presenter.name} />
                                <AvatarFallback>{getInitials(presenter.name)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{presenter.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {userAttendee && (
                      <div className="mt-4">
                        <Badge className={getRoleColor(userRole)}>
                          Your role: {userRole}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/meetings/${meeting.id}`)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="font-medium text-lg">No meetings found</h3>
              <p className="text-muted-foreground mt-1">
                {currentUser?.isAdmin 
                  ? "Create a new meeting to get started" 
                  : "You haven't been assigned to any meetings yet"}
              </p>
              {currentUser?.isAdmin && (
                <Button className="mt-4" onClick={() => navigate("/admin/meetings/new")}>
                  Create Meeting
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Meetings;
