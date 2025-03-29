
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "@/contexts/LocationContext";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { usePermission } from "@/contexts/PermissionContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Clock, Users } from "lucide-react";

const LocationSessions = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getLocation } = useLocation();
  const { getSessionsByLocationId } = useClassroomSession();
  const { can } = usePermission();
  
  const location = getLocation(id!);
  const sessions = getSessionsByLocationId(id!);

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

  if (!location) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Location not found</h1>
        <Button onClick={() => navigate("/admin/locations")}>
          Back to Locations
        </Button>
      </div>
    );
  }

  return (
    <PermissionGate 
      action={["location.view", "session.view"]}
      redirectTo="/admin"
    >
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/admin/locations/${id}`)}
              className="mb-2 px-0"
            >
              ← Back to Location Details
            </Button>
            <h1 className="text-3xl font-bold">Classroom Sessions at {location.name}</h1>
          </div>
          
          {can("session.create") && (
            <Button onClick={() => navigate("/admin/sessions/new", { state: { locationId: id } })}>
              Add Session
            </Button>
          )}
        </div>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <Card key={session.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{session.title}</CardTitle>
                  <CardDescription>{session.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-1">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{formatDate(session.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{formatTime(session.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {session.currentCampers} / {session.maxCampers} campers
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Room:</span> {session.roomName}
                  </div>
                </CardContent>
                <CardFooter className="flex space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate(`/admin/sessions/${session.id}`)}
                  >
                    View Details
                  </Button>
                  {can("session.edit") && (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate(`/admin/sessions/edit/${session.id}`)}
                    >
                      Edit
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
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
                  There are no classroom sessions scheduled at this location
                </p>
                {can("session.create") && (
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate("/admin/sessions/new", { state: { locationId: id } })}
                  >
                    Add Session
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PermissionGate>
  );
};

export default LocationSessions;
