
import React from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { useUser } from "@/contexts/UserContext";
import { useLocation } from "@/contexts/LocationContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameController, Clock, MapPin, Users, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Games = () => {
  const navigate = useNavigate();
  const { games } = useGame();
  const { currentUser, users } = useUser();
  const { locations } = useLocation();

  // Sort games by date, newest first
  const sortedGames = [...games].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // For campers, show all games. For others, filter based on role
  const userGames = currentUser?.role === "camper"
    ? sortedGames
    : currentUser?.isAdmin 
      ? sortedGames 
      : sortedGames.filter(game => 
          game.attendees.some(attendee => 
            attendee.userId === currentUser?.id && attendee.published
          )
        );

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "presenter": return "bg-blue-100 text-blue-800";
      case "observer": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const findObservers = (game: any) => {
    return game.attendees
      .filter(att => att.role === "observer" && att.published)
      .map(att => users.find(u => u.id === att.userId))
      .filter(Boolean);
  };

  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : "Unknown Location";
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Games</h1>
      </div>

      {userGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userGames.map((game) => {
            // Find user's role in this game
            const userAttendee = game.attendees.find(
              attendee => attendee.userId === currentUser?.id
            );
            const userRole = userAttendee?.role || "camper";
            
            // Get observers for this game
            const observers = findObservers(game);

            return (
              <Card key={game.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{game.title}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDate(game.date)} at {formatTime(game.date)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {getLocationName(game.locationId)} - Court {game.courtNumber}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {game.currentCampers} / {game.maxCampers} campers
                      </span>
                    </div>
                    
                    {/* Show observers for campers */}
                    {currentUser?.role === "camper" && observers.length > 0 && (
                      <div className="mt-2">
                        <div className="text-sm font-medium mb-1">Observers:</div>
                        <div className="flex flex-wrap gap-2">
                          {observers.map(observer => (
                            <div key={observer.id} className="flex items-center">
                              <Avatar className="h-6 w-6 mr-1">
                                <AvatarImage src={observer.photoUrl} alt={observer.name} />
                                <AvatarFallback>{getInitials(observer.name)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{observer.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {userAttendee && (
                      <div className="mt-4">
                        <Badge className={getRoleColor(userRole)}>
                          Your role: {userRole}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/games/${game.id}`)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <div className="mx-auto bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <GameController className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="font-medium text-lg">No games found</h3>
              <p className="text-muted-foreground mt-1">
                You haven't been assigned to any games yet
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Games;
