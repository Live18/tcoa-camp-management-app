
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { useLocation } from "@/contexts/LocationContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { AttendeeManager } from "@/components/admin/AttendeeManager";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, MapPin, Clock, BookOpen, UserPlus } from "lucide-react";

const SessionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getSession, updateSession, publishAttendees } = useClassroomSession();
  const { getLocation } = useLocation();
  
  const session = getSession(id!);
  const location = session ? getLocation(session.locationId) : null;

  if (!session) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Session not found</h1>
        <Button onClick={() => navigate("/admin/classroom-sessions")}>
          Back to Sessions
        </Button>
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

  const handleAddAttendee = (userId: string, role: string) => {
    const newAttendee = {
      userId,
      role: role as any,
      published: false,
    };
    
    // Update camper count if the new attendee is a camper
    const newCamperCount = role === "camper" 
      ? session.currentCampers + 1 
      : session.currentCampers;
    
    updateSession(session.id, {
      attendees: [...session.attendees, newAttendee],
      currentCampers: newCamperCount,
    });
  };

  const handleRemoveAttendee = (userId: string) => {
    const attendee = session.attendees.find(a => a.userId === userId);
    
    // Reduce camper count if removing a camper
    const newCamperCount = attendee && attendee.role === "camper" 
      ? session.currentCampers - 1 
      : session.currentCampers;
    
    updateSession(session.id, {
      attendees: session.attendees.filter(a => a.userId !== userId),
      currentCampers: newCamperCount,
    });
  };

  const handlePublishAttendees = (attendeeIds: string[]) => {
    publishAttendees(session.id, attendeeIds);
  };

  return (
    <PermissionGate action="session.view">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/classroom-sessions")}
            className="px-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sessions
          </Button>
          <h1 className="text-3xl font-bold">Classroom Session Details</h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{session.title}</CardTitle>
              <CardDescription>{session.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label>Date</Label>
                  </div>
                  <div className="border border-input bg-background px-3 py-2 rounded-md">
                    {formatDate(session.date)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label>Time</Label>
                  </div>
                  <div className="border border-input bg-background px-3 py-2 rounded-md">
                    {formatTime(session.date)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label>Location</Label>
                  </div>
                  <div className="border border-input bg-background px-3 py-2 rounded-md">
                    {location ? location.name : "Unknown Location"}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label>Room</Label>
                  </div>
                  <div className="border border-input bg-background px-3 py-2 rounded-md">
                    {session.roomName}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Maximum Campers</Label>
                  <div className="border border-input bg-background px-3 py-2 rounded-md">
                    {session.maxCampers}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Current Campers</Label>
                  <div className="border border-input bg-background px-3 py-2 rounded-md">
                    {session.currentCampers}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <PermissionGate action="session.edit">
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/admin/classroom-sessions/edit/${session.id}`)}
                >
                  Edit Session
                </Button>
              </PermissionGate>
            </CardFooter>
          </Card>
          
          <PermissionGate action="session.edit">
            <div className="mt-2">
              <div className="flex items-center mb-4">
                <UserPlus className="h-5 w-5 mr-2 text-primary" />
                <h2 className="text-xl font-bold">Manage Attendees</h2>
              </div>
              <Separator className="mb-6" />
              <AttendeeManager 
                attendees={session.attendees}
                onAddAttendee={handleAddAttendee}
                onRemoveAttendee={handleRemoveAttendee}
                onPublishAttendees={handlePublishAttendees}
                allowedRoles={["camper", "presenter"]}
                maxAttendees={session.maxCampers}
              />
            </div>
          </PermissionGate>
        </div>
      </div>
    </PermissionGate>
  );
};

export default SessionDetail;
