
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { useLocation } from "@/contexts/LocationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, ArrowLeft, Eye, Calendar, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { AttendeeManager } from "@/components/admin/attendee-manager/AttendeeManager";
import { toast } from "@/components/ui/use-toast";

const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getGame, updateGame, deleteGame, publishAttendees } = useGame();
  const { getLocation } = useLocation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const game = getGame(id || "");
  
  if (!game) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="ghost" onClick={() => navigate("/admin/games")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
        </Button>
        <Card>
          <CardContent className="py-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Game Not Found</h2>
            <p className="text-muted-foreground">
              The game you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/admin/games")} className="mt-4">
              View All Games
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const location = getLocation(game.locationId);
  
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

  // Count observers for this game
  const observerCount = game.attendees.filter(att => att.role === "observer").length;

  // Attendee management functions
  const handleAddAttendee = (userId: string, role: string) => {
    const updatedAttendees = [
      ...game.attendees,
      { userId, role: role as any, published: false }
    ];
    
    // Calculate the new current campers count
    const campersCount = updatedAttendees.filter(a => a.role === "camper").length;
    
    updateGame(game.id, { 
      attendees: updatedAttendees,
      currentCampers: campersCount
    });

    toast({
      title: "Attendee Added",
      description: `User has been added as a ${role}`,
    });
  };

  const handleRemoveAttendee = (userId: string) => {
    const updatedAttendees = game.attendees.filter(att => att.userId !== userId);
    
    // Calculate the new current campers count
    const campersCount = updatedAttendees.filter(a => a.role === "camper").length;
    
    updateGame(game.id, { 
      attendees: updatedAttendees,
      currentCampers: campersCount 
    });

    toast({
      title: "Attendee Removed",
      description: "User has been removed from this game",
    });
  };

  const handlePublishAttendees = (attendeeIds: string[]) => {
    publishAttendees(game.id, attendeeIds);
    toast({
      title: "Attendees Published",
      description: "Selected attendees have been published",
    });
  };
  
  const handleDeleteGame = () => {
    deleteGame(game.id);
    toast({
      title: "Game Deleted",
      description: "The game has been deleted successfully",
    });
    navigate("/admin/games");
  };

  return (
    <PermissionGate action="game.view">
      <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={() => navigate("/admin/games")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold mb-2 md:mb-0">{game.title}</h1>
          <div className="flex flex-wrap gap-2">
            <PermissionGate action="game.edit">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/admin/games/edit/${game.id}`)}
              >
                Edit Game
              </Button>
            </PermissionGate>
            
            <PermissionGate action="game.delete">
              <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Game
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this game? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteGame}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </PermissionGate>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Game Details</CardTitle>
            <CardDescription>{game.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {formatDate(game.date)} 
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {formatTime(game.date)}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {location ? `${location.name} - Court ${game.courtNumber}` : `Court ${game.courtNumber}`}
                    </span>
                  </div>
                  
                  {location && (
                    <div className="pl-6 text-sm text-muted-foreground">
                      {location.address}, {location.city}, {location.state} {location.zipCode}
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      <Badge variant="outline">{game.currentCampers} / {game.maxCampers}</Badge> campers
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">{observerCount}</Badge> observers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="my-8">
          <PermissionGate action="game.manage_attendees" fallback={
            <Card>
              <CardContent className="py-6">
                <p className="text-center text-muted-foreground">You don't have permission to manage attendees.</p>
              </CardContent>
            </Card>
          }>
            <AttendeeManager 
              attendees={game.attendees}
              onAddAttendee={handleAddAttendee}
              onRemoveAttendee={handleRemoveAttendee}
              onPublishAttendees={handlePublishAttendees}
              allowedRoles={["camper", "observer"]}
              maxAttendees={game.maxCampers}
              eventDate={game.date}
            />
          </PermissionGate>
        </div>
      </div>
    </PermissionGate>
  );
};

export default GameDetail;
