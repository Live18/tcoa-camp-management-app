
import React from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/contexts/UserContext";
import { Game as GameType } from "@/contexts/GameContext";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Calendar, MapPin, Gamepad, BookOpen, Eye } from "lucide-react";

interface Attendee {
  userId: string;
  role: string;
  published: boolean;
}

// Use the type from context instead of redefining it
interface Session {
  id: string;
  title: string;
  date: string;
  roomName: string;
  attendees: Attendee[];
}

interface UserAssignmentCardProps {
  userId: string;
  assignedGames: GameType[];
  assignedSessions: Session[];
}

export const UserAssignmentCard: React.FC<UserAssignmentCardProps> = ({ 
  userId, 
  assignedGames, 
  assignedSessions 
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
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

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "presenter": return "bg-blue-100 text-blue-800";
      case "observer": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Assignments</CardTitle>
        <CardDescription>
          Games and classroom sessions this user is assigned to
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="games" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="sessions">Classroom Sessions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="games" className="space-y-4 mt-4">
            {assignedGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignedGames.map(game => {
                  const attendee = game.attendees.find(a => a.userId === userId);
                  return (
                    <Card key={game.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{game.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2 space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatDate(game.date)} at {formatTime(game.date)}
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          Court {game.courtNumber}
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={getRoleBadgeClass(attendee?.role || "")}>
                            {attendee?.role}
                          </Badge>
                          
                          {attendee?.published ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              Unpublished
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => navigate(`/admin/games/${game.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" /> View Game
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Gamepad className="mx-auto h-8 w-8 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">No Games</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  This user is not assigned to any games
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sessions" className="space-y-4 mt-4">
            {assignedSessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignedSessions.map(session => {
                  const attendee = session.attendees.find(a => a.userId === userId);
                  return (
                    <Card key={session.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{session.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2 space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatDate(session.date)} at {formatTime(session.date)}
                        </div>
                        <div className="flex items-center text-sm">
                          <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                          {session.roomName}
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={getRoleBadgeClass(attendee?.role || "")}>
                            {attendee?.role}
                          </Badge>
                          
                          {attendee?.published ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              Unpublished
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => navigate(`/admin/sessions/${session.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" /> View Session
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">No Sessions</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  This user is not assigned to any classroom sessions
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
