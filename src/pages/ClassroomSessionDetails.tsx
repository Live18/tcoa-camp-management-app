
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { useUser } from "@/contexts/UserContext";
import { useLocation } from "@/contexts/LocationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, Users, ArrowLeft } from "lucide-react";

const ClassroomSessionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSession } = useClassroomSession();
  const { users } = useUser();
  const { getLocation } = useLocation();
  
  const session = getSession(id || "");
  
  if (!session) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="ghost" onClick={() => navigate("/classroom-sessions")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sessions
        </Button>
        <Card>
          <CardContent className="py-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Session Not Found</h2>
            <p className="text-muted-foreground">
              The classroom session you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/classroom-sessions")} className="mt-4">
              View All Sessions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const location = getLocation(session.locationId);
  
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  // Get all published attendees by role
  const campers = session.attendees
    .filter(att => att.role === "camper" && att.published)
    .map(att => users.find(u => u.id === att.userId))
    .filter(Boolean);

  const presenters = session.attendees
    .filter(att => att.role === "presenter" && att.published)
    .map(att => users.find(u => u.id === att.userId))
    .filter(Boolean);

  return (
    <div className="container mx-auto py-6">
      <Button variant="ghost" onClick={() => navigate("/classroom-sessions")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sessions
      </Button>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{session.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>{session.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {formatDate(session.date)} at {formatTime(session.date)}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {location ? `${location.name} - ${session.roomName}` : session.roomName}
                  </span>
                </div>
                
                {location && (
                  <div className="pl-6 text-sm text-muted-foreground">
                    {location.address}, {location.city}, {location.state} {location.zipCode}
                  </div>
                )}
                
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {session.currentCampers} / {session.maxCampers} campers
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Presenters</CardTitle>
          </CardHeader>
          <CardContent>
            {presenters.length > 0 ? (
              <div className="space-y-3">
                {presenters.map(presenter => (
                  <div key={presenter.id} className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={presenter.photoUrl} alt={presenter.name} />
                      <AvatarFallback>{getInitials(presenter.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{presenter.name}</div>
                      <div className="text-sm text-muted-foreground">{presenter.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No presenters assigned yet</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Campers</CardTitle>
          </CardHeader>
          <CardContent>
            {campers.length > 0 ? (
              <div className="space-y-3">
                {campers.map(camper => (
                  <div key={camper.id} className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={camper.photoUrl} alt={camper.name} />
                      <AvatarFallback>{getInitials(camper.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{camper.name}</div>
                      <div className="text-sm text-muted-foreground">{camper.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No campers assigned yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClassroomSessionDetails;
