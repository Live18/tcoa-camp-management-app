
import React from "react";
import { useNavigate } from "react-router-dom";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { useUser } from "@/contexts/UserContext";
import { useLocation } from "@/contexts/LocationContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, MapPin, Users, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ClassroomSessions = () => {
  const navigate = useNavigate();
  const { sessions } = useClassroomSession();
  const { currentUser, users } = useUser();
  const { locations } = useLocation();

  // Sort sessions by date, newest first
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // For campers, show all sessions. For others, filter based on role
  const userSessions = currentUser?.role === "camper"
    ? sortedSessions
    : currentUser?.isAdmin 
      ? sortedSessions 
      : sortedSessions.filter(session => 
          session.attendees.some(attendee => 
            attendee.userId === currentUser?.id && attendee.published
          )
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
      case "camper": return "bg-purple-100 text-purple-800";
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

  const findPresenters = (session: any) => {
    return session.attendees
      .filter(att => att.role === "presenter" && att.published)
      .map(att => users.find(u => u.id === att.userId))
      .filter(Boolean);
  };

  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : "Unknown Location";
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Classroom Sessions</h1>
      </div>

      {userSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userSessions.map((session) => {
            // Find user's role in this session
            const userAttendee = session.attendees.find(
              attendee => attendee.userId === currentUser?.id
            );
            const userRole = userAttendee?.role || "camper";
            
            // Get presenters for this session
            const presenters = findPresenters(session);

            return (
              <Card key={session.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{session.title}</CardTitle>
                  <CardDescription>{session.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDate(session.date)} at {formatTime(session.date)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {getLocationName(session.locationId)} - {session.roomName}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {session.currentCampers} / {session.maxCampers} campers
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
                    onClick={() => navigate(`/classroom-sessions/${session.id}`)}
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
              <div className="mx-auto bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="font-medium text-lg">No classroom sessions found</h3>
              <p className="text-muted-foreground mt-1">
                You haven't been assigned to any classroom sessions yet
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClassroomSessions;
