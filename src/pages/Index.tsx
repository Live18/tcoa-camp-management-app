
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useGame } from "@/contexts/GameContext";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, Gamepad, BookOpen, Clock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { games } = useGame();
  const { sessions } = useClassroomSession();
  
  // Get the current user's games and sessions
  const userGames = games.filter(game => 
    game.attendees.some(a => a.userId === currentUser?.id && a.published)
  );
  
  const userSessions = sessions.filter(session => 
    session.attendees.some(a => a.userId === currentUser?.id && a.published)
  );
  
  // Sort by date to get upcoming events
  const allUserEvents = [
    ...userGames.map(g => ({ ...g, type: 'game' })),
    ...userSessions.map(s => ({ ...s, type: 'session' }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Get only future events
  const now = new Date();
  const upcomingEvents = allUserEvents.filter(e => new Date(e.date) > now).slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
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

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">TCOA Camp Management</h1>
        <p className="text-muted-foreground">
          Welcome back, {currentUser?.name}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gamepad className="mr-2 h-5 w-5" />
              Games
            </CardTitle>
            <CardDescription>
              View your assigned games
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userGames.length}</div>
            <p className="text-muted-foreground">Assigned games</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/games")} variant="outline" className="w-full">
              View Games
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Classroom Sessions
            </CardTitle>
            <CardDescription>
              View your classroom sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userSessions.length}</div>
            <p className="text-muted-foreground">Assigned sessions</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/classroom-sessions")} variant="outline" className="w-full">
              View Sessions
            </Button>
          </CardFooter>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <CalendarClock className="mr-2 h-5 w-5" />
        Upcoming Schedule
      </h2>

      {upcomingEvents.length > 0 ? (
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="p-4 sm:p-6 sm:border-r flex items-center justify-center bg-secondary sm:w-1/4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatDate(event.date)}</div>
                    <div className="text-muted-foreground">{formatTime(event.date)}</div>
                  </div>
                </div>
                <div className="flex-1 p-4 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>
                          {event.type === 'game' 
                            ? `Court ${(event as any).courtNumber}` 
                            : `Room ${(event as any).roomName}`}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(
                        event.type === 'game' 
                          ? `/games/${event.id}` 
                          : `/classroom-sessions/${event.id}`
                      )}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate(
                userGames.length > userSessions.length ? "/games" : "/classroom-sessions"
              )}
            >
              View Full Schedule
            </Button>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="py-6 text-center">
            <div className="mx-auto bg-secondary rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <CalendarClock className="h-6 w-6 text-secondary-foreground" />
            </div>
            <h3 className="font-medium text-lg">No upcoming events</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              You don't have any upcoming games or sessions scheduled
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="outline" onClick={() => navigate("/games")}>
                View Games
              </Button>
              <Button variant="outline" onClick={() => navigate("/classroom-sessions")}>
                View Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;
