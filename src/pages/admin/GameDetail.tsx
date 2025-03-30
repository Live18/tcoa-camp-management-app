
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
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
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";

const GameDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getGame, updateGame, publishAttendees } = useGame();
  const { getLocation } = useLocation();
  
  const game = getGame(id!);
  const location = game ? getLocation(game.locationId) : null;

  if (!game) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Game not found</h1>
        <Button onClick={() => navigate("/admin/games")}>
          Back to Games
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
      ? game.currentCampers + 1 
      : game.currentCampers;
    
    updateGame(game.id, {
      attendees: [...game.attendees, newAttendee],
      currentCampers: newCamperCount,
    });
  };

  const handleRemoveAttendee = (userId: string) => {
    const attendee = game.attendees.find(a => a.userId === userId);
    
    // Reduce camper count if removing a camper
    const newCamperCount = attendee && attendee.role === "camper" 
      ? game.currentCampers - 1 
      : game.currentCampers;
    
    updateGame(game.id, {
      attendees: game.attendees.filter(a => a.userId !== userId),
      currentCampers: newCamperCount,
    });
  };

  const handlePublishAttendees = (attendeeIds: string[]) => {
    publishAttendees(game.id, attendeeIds);
  };

  return (
    <PermissionGate action="game.view">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/games")}
            className="px-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Button>
          <h1 className="text-3xl font-bold">Game Details</h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{game.title}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label>Date</Label>
                  </div>
                  <div className="border border-input bg-background px-3 py-2 rounded-md">
                    {formatDate(game.date)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label>Time</Label>
                  </div>
                  <div className="border border-input bg-background px-3 py-2 rounded-md">
                    {formatTime(game.date)}
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
                  <Label>Court Number</Label>
                  <div className="border border-input bg-background px-3 py-2 rounded-md">
                    {game.courtNumber}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Maximum Campers</Label>
                  <div className="border border-input bg-background px-3 py-2 rounded-md">
                    {game.maxCampers}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Current Campers</Label>
                  <div className="border border-input bg-background px-3 py-2 rounded-md">
                    {game.currentCampers}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <PermissionGate action="game.edit">
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/admin/games/edit/${game.id}`)}
                >
                  Edit Game
                </Button>
              </PermissionGate>
            </CardFooter>
          </Card>
          
          <PermissionGate action="game.edit">
            <AttendeeManager 
              attendees={game.attendees}
              onAddAttendee={handleAddAttendee}
              onRemoveAttendee={handleRemoveAttendee}
              onPublishAttendees={handlePublishAttendees}
              allowedRoles={["camper", "observer"]}
              maxAttendees={game.maxCampers}
            />
          </PermissionGate>
        </div>
      </div>
    </PermissionGate>
  );
};

export default GameDetail;
