import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { useLocation } from "@/contexts/LocationContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ManagementPageHeader from "@/components/admin/common/ManagementPageHeader";
import SessionManagementFilters from "@/components/admin/session/SessionManagementFilters";
import SessionManagementList from "@/components/admin/session/SessionManagementList";
import { formatDate, formatTime } from "@/utils/dateUtils";

const SessionManagement = () => {
  const navigate = useNavigate();
  const { sessions, deleteSession } = useClassroomSession();
  const { locations, getLocation } = useLocation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [showPastSessions, setShowPastSessions] = useState(true);

  // Filter sessions based on search term, location, and date
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter === "all" || session.locationId === locationFilter;
      
      // Filter out past sessions unless showPastSessions is true
      const sessionDate = new Date(session.date);
      const isVisible = showPastSessions || sessionDate >= new Date();
      
      return matchesSearch && matchesLocation && isVisible;
    });
  }, [sessions, searchTerm, locationFilter, showPastSessions]);

  const handleDelete = (id: string, title: string) => {
    deleteSession(id);
    toast({
      title: "Session Deleted",
      description: `${title} has been deleted.`,
    });
  };

  return (
    <PermissionGate action="session.view">
      <div className="container mx-auto py-6">
        <ManagementPageHeader 
          title="Session Management"
          createButtonLabel="Add Session"
          createPermission="session.create"
          createPath="/admin/sessions/new"
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
            <CardDescription>
              Manage all sessions
            </CardDescription>
            <SessionManagementFilters
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
            <SessionManagementList
              sessions={filteredSessions}
              getLocation={getLocation}
              formatDate={formatDate}
              formatTime={formatTime}
              onDeleteSession={handleDelete}
            />
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
};

export default SessionManagement;
