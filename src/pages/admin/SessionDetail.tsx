
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { useLocation } from "@/contexts/LocationContext";
import { Card, CardContent } from "@/components/ui/card";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { AttendeeManager } from "@/components/admin/AttendeeManager";
import SessionDetailHeader from "@/components/admin/session/SessionDetailHeader";
import SessionDetailsCard from "@/components/admin/session/SessionDetailsCard";
import SessionNotFound from "@/components/admin/session/SessionNotFound";

const SessionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSession, updateSession, publishAttendees } = useClassroomSession();
  const { getLocation } = useLocation();
  
  // Determine the path we came from to dynamically set the back button
  const pathname = window.location.pathname;
  const isClassroomSession = pathname.includes("classroom-sessions");
  const backPath = isClassroomSession 
    ? "/admin/classroom-sessions" 
    : "/admin/sessions";
  
  const session = getSession(id || "");
  
  if (!session) {
    return <SessionNotFound backPath={backPath} />;
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

  return (
    <PermissionGate action="session.view">
      <div className="container mx-auto py-6">
        <SessionDetailHeader 
          backPath={backPath} 
          isClassroomSession={isClassroomSession} 
        />
        
        <SessionDetailsCard
          session={session}
          location={location}
          formatDate={formatDate}
          formatTime={formatTime}
        />
        
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
              onPublishAttendees={(attendeeIds) => publishAttendees(session.id, attendeeIds)}
              allowedRoles={["camper", "observer", "presenter"]}
              maxAttendees={session.maxCampers}
              eventDate={session.date}
            />
          </PermissionGate>
        </div>
      </div>
    </PermissionGate>
  );
};

export default SessionDetail;
