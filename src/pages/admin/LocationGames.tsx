
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "@/contexts/LocationContext";
import { useGame } from "@/contexts/GameContext";
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
import { Gamepad, Calendar, Clock, Users } from "lucide-react";

const LocationGames = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getLocation } = useLocation();
  const { getGamesByLocationId } = useGame();
  const { can } = usePermission();
  
  const location = getLocation(id!);
  const games = getGamesByLocationId(id!);

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
      action={["location.view", "game.view"]}
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
            <h1 className="text-3xl font-bold">Games at {location.name}</h1>
          </div>
          
          {can("game.create") && (
            <Button onClick={() => navigate("/admin/games/new", { state: { locationId: id } })}>
              Add Game
            </Button>
          )}
        </div>

        {games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card key={game.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{game.title}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-1">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{formatDate(game.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{formatTime(game.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {game.currentCampers} / {game.maxCampers} campers
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Court:</span> {game.courtNumber}
                  </div>
                </CardContent>
                <CardFooter className="flex space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate(`/admin/games/${game.id}`)}
                  >
                    View Details
                  </Button>
                  {can("game.edit") && (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate(`/admin/games/edit/${game.id}`)}
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
                  <Gamepad className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="font-medium text-lg">No games found</h3>
                <p className="text-muted-foreground mt-1">
                  There are no games scheduled at this location
                </p>
                {can("game.create") && (
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate("/admin/games/new", { state: { locationId: id } })}
                  >
                    Add Game
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

export default LocationGames;
