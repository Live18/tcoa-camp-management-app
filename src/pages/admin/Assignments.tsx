
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { useUser } from "@/contexts/UserContext";
import { useLocation } from "@/contexts/LocationContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { 
  Gamepad, 
  BookOpen, 
  Check, 
  ArrowLeft, 
  Calendar,
  MapPin,
  User,
  Clock, // Added missing Clock import
} from "lucide-react";

import { 
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AttendeeManager } from "@/components/admin/AttendeeManager";

const Assignments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { games, getGame, publishAttendees: publishGameAttendees, updateGame } = useGame();
  const { 
    sessions, 
    getSession, 
    publishAttendees: publishSessionAttendees, 
    updateSession 
  } = useClassroomSession();
  const { users } = useUser();
  const { getLocation } = useLocation();
  const [activeTab, setActiveTab] = useState("games");
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Get unpublished game attendees
  const unpublishedGameAttendees = games.flatMap(game => 
    game.attendees
      .filter(att => !att.published)
      .map(att => ({
        gameId: game.id,
        game,
        attendee: att,
        user: users.find(u => u.id === att.userId),
      }))
  );

  // Get unpublished session attendees
  const unpublishedSessionAttendees = sessions.flatMap(session => 
    session.attendees
      .filter(att => !att.published)
      .map(att => ({
        sessionId: session.id,
        session,
        attendee: att,
        user: users.find(u => u.id === att.userId),
      }))
  );

  // Group game attendees by game
  const groupedGameAttendees = unpublishedGameAttendees.reduce((acc, curr) => {
    const gameId = curr.gameId;
    if (!acc[gameId]) {
      acc[gameId] = {
        game: curr.game,
        attendees: []
      };
    }
    acc[gameId].attendees.push({
      userId: curr.attendee.userId,
      role: curr.attendee.role,
      user: curr.user
    });
    return acc;
  }, {} as Record<string, { game: any, attendees: any[] }>);

  // Group session attendees by session
  const groupedSessionAttendees = unpublishedSessionAttendees.reduce((acc, curr) => {
    const sessionId = curr.sessionId;
    if (!acc[sessionId]) {
      acc[sessionId] = {
        session: curr.session,
        attendees: []
      };
    }
    acc[sessionId].attendees.push({
      userId: curr.attendee.userId,
      role: curr.attendee.role,
      user: curr.user
    });
    return acc;
  }, {} as Record<string, { session: any, attendees: any[] }>);

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

  const handlePublishGameAttendees = (gameId: string) => {
    const game = getGame(gameId);
    if (!game) return;
    
    const unpublishedIds = game.attendees
      .filter(att => !att.published)
      .map(att => att.userId);
    
    if (unpublishedIds.length > 0) {
      publishGameAttendees(gameId, unpublishedIds);
      toast({
        title: "Attendees Published",
        description: `Successfully published ${unpublishedIds.length} game attendees`,
      });
    }
  };

  const handlePublishSessionAttendees = (sessionId: string) => {
    const session = getSession(sessionId);
    if (!session) return;
    
    const unpublishedIds = session.attendees
      .filter(att => !att.published)
      .map(att => att.userId);
    
    if (unpublishedIds.length > 0) {
      publishSessionAttendees(sessionId, unpublishedIds);
      toast({
        title: "Attendees Published",
        description: `Successfully published ${unpublishedIds.length} session attendees`,
      });
    }
  };

  const handlePublishAll = () => {
    // Publish all game attendees
    games.forEach(game => {
      const unpublishedIds = game.attendees
        .filter(att => !att.published)
        .map(att => att.userId);
      
      if (unpublishedIds.length > 0) {
        publishGameAttendees(game.id, unpublishedIds);
      }
    });

    // Publish all session attendees
    sessions.forEach(session => {
      const unpublishedIds = session.attendees
        .filter(att => !att.published)
        .map(att => att.userId);
      
      if (unpublishedIds.length > 0) {
        publishSessionAttendees(session.id, unpublishedIds);
      }
    });

    toast({
      title: "All Attendees Published",
      description: "Successfully published all unpublished attendees",
    });
  };

  const handleAddGameAttendee = (gameId: string, userId: string, role: string) => {
    const game = getGame(gameId);
    if (!game) return;

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

    toast({
      title: "Attendee Added",
      description: `User has been added to ${game.title} as a ${role}`,
    });
  };

  const handleRemoveGameAttendee = (gameId: string, userId: string) => {
    const game = getGame(gameId);
    if (!game) return;

    const attendee = game.attendees.find(a => a.userId === userId);
    
    // Reduce camper count if removing a camper
    const newCamperCount = attendee && attendee.role === "camper" 
      ? game.currentCampers - 1 
      : game.currentCampers;
    
    updateGame(game.id, {
      attendees: game.attendees.filter(a => a.userId !== userId),
      currentCampers: newCamperCount,
    });

    toast({
      title: "Attendee Removed",
      description: "The user has been removed from this game",
    });
  };

  const handleAddSessionAttendee = (sessionId: string, userId: string, role: string) => {
    const session = getSession(sessionId);
    if (!session) return;

    const newAttendee = {
      userId,
      role: role as any,
      published: false,
    };
    
    // Update camper count if the new attendee is a camper
    const newCamperCount = role === "camper" 
      ? session.currentCampers + 1 
      : session.currentCampers;
    
    updateSession(session.id, {
      attendees: [...session.attendees, newAttendee],
      currentCampers: newCamperCount,
    });

    toast({
      title: "Attendee Added",
      description: `User has been added to ${session.title} as a ${role}`,
    });
  };

  const handleRemoveSessionAttendee = (sessionId: string, userId: string) => {
    const session = getSession(sessionId);
    if (!session) return;

    const attendee = session.attendees.find(a => a.userId === userId);
    
    // Reduce camper count if removing a camper
    const newCamperCount = attendee && attendee.role === "camper" 
      ? session.currentCampers - 1 
      : session.currentCampers;
    
    updateSession(session.id, {
      attendees: session.attendees.filter(a => a.userId !== userId),
      currentCampers: newCamperCount,
    });

    toast({
      title: "Attendee Removed",
      description: "The user has been removed from this session",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const totalUnpublished = unpublishedGameAttendees.length + unpublishedSessionAttendees.length;

  return (
    <PermissionGate action="user.edit">
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin")}
              className="mb-2 px-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Unpublished Assignments</h1>
          </div>
          {totalUnpublished > 0 && (
            <Button 
              onClick={handlePublishAll}
              className="mt-4 md:mt-0"
            >
              <Check className="mr-2 h-4 w-4" /> Publish All Assignments
            </Button>
          )}
        </div>

        {totalUnpublished === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-medium mb-2">All Assignments Published</h3>
              <p className="text-muted-foreground">
                There are no unpublished assignments to review
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="games" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="games" className="flex items-center">
                <Gamepad className="mr-2 h-4 w-4" />
                Games
                {unpublishedGameAttendees.length > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {unpublishedGameAttendees.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="sessions" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Classroom Sessions
                {unpublishedSessionAttendees.length > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {unpublishedSessionAttendees.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="games">
              {Object.keys(groupedGameAttendees).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(groupedGameAttendees).map(([gameId, data]) => {
                    const { game, attendees } = data;
                    const location = getLocation(game.locationId);
                    
                    return (
                      <Card key={gameId}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl">
                                <Button 
                                  variant="link" 
                                  className="p-0 h-auto font-bold text-xl text-foreground hover:text-primary justify-start"
                                  onClick={() => navigate(`/admin/games/${game.id}`)}
                                >
                                  {game.title}
                                </Button>
                              </CardTitle>
                              <CardDescription>
                                <div className="flex flex-col sm:flex-row sm:items-center mt-1 gap-x-4">
                                  <div className="flex items-center">
                                    <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      {formatDate(game.date)}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      {formatTime(game.date)}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      {location ? location.name : "Unknown"} - Court {game.courtNumber}
                                    </span>
                                  </div>
                                </div>
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => navigate(`/admin/games/${game.id}`)}
                                variant="outline"
                              >
                                Manage Game
                              </Button>
                              <Dialog open={selectedGameId === game.id} onOpenChange={(open) => {
                                if (open) setSelectedGameId(game.id);
                                else setSelectedGameId(null);
                              }}>
                                <DialogTrigger asChild>
                                  <Button size="sm">
                                    Edit Attendees
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>Edit Game Attendees</DialogTitle>
                                    <DialogDescription>
                                      Add or remove attendees for {game.title}
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedGameId && (
                                    <AttendeeManager 
                                      attendees={getGame(selectedGameId)?.attendees || []}
                                      onAddAttendee={(userId, role) => handleAddGameAttendee(selectedGameId, userId, role)}
                                      onRemoveAttendee={(userId) => handleRemoveGameAttendee(selectedGameId, userId)}
                                      onPublishAttendees={(attendeeIds) => {
                                        publishGameAttendees(selectedGameId, attendeeIds);
                                        toast({
                                          title: "Attendees Published",
                                          description: "Successfully published attendees",
                                        });
                                      }}
                                      allowedRoles={["camper", "observer"]}
                                      maxAttendees={game.maxCampers}
                                    />
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Attendee</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {attendees.map(({ userId, role, user }) => (
                                <TableRow key={`${game.id}-${userId}`}>
                                  <TableCell>
                                    {user ? (
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                          <AvatarImage src={user.photoUrl} alt={user.name} />
                                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <div className="font-medium">{user.name}</div>
                                          <div className="text-xs text-muted-foreground">{user.email}</div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-muted-foreground">Unknown User</div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={role === "camper" ? "bg-gray-100" : "bg-green-100 text-green-800"}>
                                      {role === "camper" ? "Camper" : "Observer"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button 
                                      onClick={() => handlePublishGameAttendees(game.id)}
                                      size="sm"
                                      variant="default"
                                    >
                                      <Check className="mr-2 h-3 w-3" /> Publish
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <div className="mx-auto bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <h3 className="font-medium text-lg">All Game Assignments Published</h3>
                    <p className="text-muted-foreground mt-1">
                      There are no unpublished game assignments
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="sessions">
              {Object.keys(groupedSessionAttendees).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(groupedSessionAttendees).map(([sessionId, data]) => {
                    const { session, attendees } = data;
                    const location = getLocation(session.locationId);
                    
                    return (
                      <Card key={sessionId}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl">
                                <Button 
                                  variant="link" 
                                  className="p-0 h-auto font-bold text-xl text-foreground hover:text-primary justify-start"
                                  onClick={() => navigate(`/admin/sessions/${session.id}`)}
                                >
                                  {session.title}
                                </Button>
                              </CardTitle>
                              <CardDescription>
                                <div className="flex flex-col sm:flex-row sm:items-center mt-1 gap-x-4">
                                  <div className="flex items-center">
                                    <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      {formatDate(session.date)}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      {formatTime(session.date)}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      {location ? location.name : "Unknown"} - Room {session.roomNumber}
                                    </span>
                                  </div>
                                </div>
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => navigate(`/admin/sessions/${session.id}`)}
                                variant="outline"
                              >
                                Manage Session
                              </Button>
                              <Dialog open={selectedSessionId === session.id} onOpenChange={(open) => {
                                if (open) setSelectedSessionId(session.id);
                                else setSelectedSessionId(null);
                              }}>
                                <DialogTrigger asChild>
                                  <Button size="sm">
                                    Edit Attendees
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>Edit Session Attendees</DialogTitle>
                                    <DialogDescription>
                                      Add or remove attendees for {session.title}
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedSessionId && (
                                    <AttendeeManager 
                                      attendees={getSession(selectedSessionId)?.attendees || []}
                                      onAddAttendee={(userId, role) => handleAddSessionAttendee(selectedSessionId, userId, role)}
                                      onRemoveAttendee={(userId) => handleRemoveSessionAttendee(selectedSessionId, userId)}
                                      onPublishAttendees={(attendeeIds) => {
                                        publishSessionAttendees(selectedSessionId, attendeeIds);
                                        toast({
                                          title: "Attendees Published",
                                          description: "Successfully published attendees",
                                        });
                                      }}
                                      allowedRoles={["camper", "observer", "presenter"]}
                                      maxAttendees={session.maxCampers}
                                    />
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Attendee</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {attendees.map(({ userId, role, user }) => (
                                <TableRow key={`${session.id}-${userId}`}>
                                  <TableCell>
                                    {user ? (
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                          <AvatarImage src={user.photoUrl} alt={user.name} />
                                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <div className="font-medium">{user.name}</div>
                                          <div className="text-xs text-muted-foreground">{user.email}</div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-muted-foreground">Unknown User</div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Badge 
                                      variant="outline" 
                                      className={
                                        role === "camper" ? "bg-gray-100" : 
                                        role === "observer" ? "bg-green-100 text-green-800" :
                                        "bg-blue-100 text-blue-800"
                                      }
                                    >
                                      {role === "camper" ? "Camper" : 
                                       role === "observer" ? "Observer" : "Presenter"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button 
                                      onClick={() => handlePublishSessionAttendees(session.id)}
                                      size="sm"
                                      variant="default"
                                    >
                                      <Check className="mr-2 h-3 w-3" /> Publish
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <div className="mx-auto bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <h3 className="font-medium text-lg">All Session Assignments Published</h3>
                    <p className="text-muted-foreground mt-1">
                      There are no unpublished session assignments
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </PermissionGate>
  );
};

export default Assignments;
