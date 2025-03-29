
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "@/contexts/LocationContext";
import { useGame } from "@/contexts/GameContext";
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
import { Badge } from "@/components/ui/badge";
import { MapPin, Gamepad, BookOpen } from "lucide-react";

const LocationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getLocation } = useLocation();
  const { getGamesByLocationId } = useGame();
  const { getSessionsByLocationId } = useClassroomSession();
  const { can } = usePermission();
  
  const location = getLocation(id!);
  const games = getGamesByLocationId(id!);
  const sessions = getSessionsByLocationId(id!);

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
      action="location.view"
      redirectTo="/admin/locations"
    >
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin/locations")}
              className="mb-2 px-0"
            >
              ← Back to Locations
            </Button>
            <h1 className="text-3xl font-bold">{location.name}</h1>
          </div>
          
          {can("location.edit") && (
            <Button onClick={() => navigate(`/admin/locations/edit/${id}`)}>
              Edit Location
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
                <CardDescription>
                  Full information about this location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                  <p className="mt-1">{location.address}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">City</h3>
                    <p className="mt-1">{location.city}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">State</h3>
                    <p className="mt-1">{location.state}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Zip Code</h3>
                    <p className="mt-1">{location.zipCode}</p>
                  </div>
                </div>
                
                {location.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                    <p className="mt-1">{location.notes}</p>
                  </div>
                )}
                
                {location.coordinates && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Coordinates</h3>
                    <p className="mt-1">
                      Lat: {location.coordinates.lat}, Lng: {location.coordinates.lng}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
                <CardDescription>
                  Games and sessions at this location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <Gamepad className="h-5 w-5 mr-2 text-muted-foreground" />
                    <h3 className="font-medium">Games</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold">{games.length}</p>
                    <Badge variant="outline">{games.length} total</Badge>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                    <h3 className="font-medium">Classroom Sessions</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold">{sessions.length}</p>
                    <Badge variant="outline">{sessions.length} total</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/admin/locations/${id}/games`)}
                >
                  View Games
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/admin/locations/${id}/sessions`)}
                >
                  View Sessions
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PermissionGate>
  );
};

export default LocationDetails;
