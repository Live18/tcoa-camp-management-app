
import React, { useState, useMemo } from "react";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { useLocation } from "@/contexts/LocationContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { formatDate, formatTime } from "@/utils/dateUtils";
import ManagementPageHeader from "@/components/admin/common/ManagementPageHeader";
import SessionFilters from "@/components/admin/session/SessionFilters";
import SessionList from "@/components/admin/session/SessionList";

const ClassroomSessionManagement = () => {
  const { sessions } = useClassroomSession();
  const { locations } = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [showPastSessions, setShowPastSessions] = useState(false);

  // Filter sessions based on search term, location, and date
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter === "all" || session.locationId === locationFilter;
      
      // Filter out past sessions unless showPastSessions is true
      const sessionDate = new Date(session.date);
      const isUpcoming = sessionDate >= new Date() || showPastSessions;
      
      return matchesSearch && matchesLocation && isUpcoming;
    });
  }, [sessions, searchTerm, locationFilter, showPastSessions]);

  // Sort sessions by date
  const sortedSessions = useMemo(() => {
    return [...filteredSessions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [filteredSessions]);

  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : "Unknown Location";
  };

  // Count presenters for a session
  const countPresenters = (session: any) => {
    return session.attendees.filter(att => att.role === "presenter").length;
  };

  return (
    <PermissionGate action="session.view">
      <div className="container mx-auto py-6">
        <ManagementPageHeader 
          title="Classroom Session Management"
          createButtonLabel="Create Session"
          createPermission="session.create"
          createPath="/admin/classroom-sessions/new"
        />
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <SessionFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              showPastSessions={showPastSessions}
              setShowPastSessions={setShowPastSessions}
              locations={locations}
            />
          </CardHeader>
          <CardContent>
            <SessionList 
              sessions={sortedSessions}
              formatDate={formatDate}
              formatTime={formatTime}
              getLocationName={getLocationName}
              countPresenters={countPresenters}
              locationFilter={locationFilter}
            />
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
};

export default ClassroomSessionManagement;
