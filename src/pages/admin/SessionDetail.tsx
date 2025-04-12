
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { useLocation } from "@/contexts/LocationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, ArrowLeft } from "lucide-react";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { AttendeeManager } from "@/components/admin/AttendeeManager";
import { toast } from "@/components/ui/use-toast";

const SessionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSession, updateSession, publishAttendees } = useClassroomSession();
  const { getLocation } = useLocation();
  
  const session = getSession(id || "");
  
  if (!session) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="ghost" onClick={() => navigate("/admin/classroom-sessions")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sessions
        </Button>
        <Card>
          <CardContent className="py-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Session Not Found</h2>
            <p className="text-muted-foreground">
              The classroom session you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/admin/classroom-sessions")} className="mt-4">
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

  // Attendee management functions
  const handleAddAttendee = (userId: string, role: string) => {
    const updatedAttendees = [
      ...session.attendees,
      { userId, role: role as any, published: false }
    ];
    
    // Calculate the new current campers count
    const campersCount = updatedAttendees.filter(a => a.role === "camper").length;
    
    updateSession(session.id, { 
      attendees: updatedAttendees,
      currentCampers: campersCount
    });
  };

  const handleRemoveAttendee = (userId: string) => {
    const updatedAttendees = session.attendees.filter(att => att.userId !== userId);
    
    // Calculate the new current campers count
    const campersCount = updatedAttendees.filter(a => a.role === "camper").length;
    
    updateSession(session.id, { 
      attendees: updatedAttendees,
      currentCampers: campersCount 
    });
  };

  const handlePublishAttendees = (attendeeIds: string[]) => {
    publishAttendees(session.id, attendeeIds);
    
    toast({
      title: "Attendees Published",
      description: `${attendeeIds.length} attendee assignments have been published.`
    });
  };

  return (
    <PermissionGate action="session.view">
      <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={() => navigate("/admin/classroom-sessions")} className="mb-4">
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
                      <Badge variant="outline">{session.currentCampers} / {session.maxCampers}</Badge> campers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="my-8">
          <PermissionGate action="session.edit" fallback={
            <Card>
              <CardContent className="py-6">
                <p className="text-center text-muted-foreground">You don't have permission to manage attendees.</p>
              </CardContent>
            </Card>
          }>
            <AttendeeManager 
              attendees={session.attendees}
              onAddAttendee={handleAddAttendee}
              onRemoveAttendee={handleRemoveAttendee}
              onPublishAttendees={handlePublishAttendees}
              allowedRoles={["camper", "observer", "presenter"]}
              maxAttendees={session.maxCampers}
            />
          </PermissionGate>
        </div>
      </div>
    </PermissionGate>
  );
};

export default SessionDetail;
