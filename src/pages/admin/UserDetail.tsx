
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useGame } from "@/contexts/GameContext";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Pencil, Trash2, ArrowLeft, Calendar, MapPin, Clock, Gamepad, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { users, setUsers } = useUser();
  const { games } = useGame();
  const { sessions } = useClassroomSession();
  
  // Find the user by ID
  const user = users.find(user => user.id === id);

  // Get games assigned to this user
  const assignedGames = games.filter(game => 
    game.attendees.some(attendee => attendee.userId === id)
  );

  // Get sessions assigned to this user
  const assignedSessions = sessions.filter(session => 
    session.attendees.some(attendee => attendee.userId === id)
  );

  const handleDelete = () => {
    if (!user) return;
    
    // Delete user
    setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
    
    toast({
      title: "User Deleted",
      description: `${user.name} has been deleted from the system.`,
    });
    
    navigate("/admin/users");
  };

  // If user not found
  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>User Not Found</CardTitle>
            <CardDescription>The user you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/admin/users")}>Back to Users</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "presenter": return "bg-blue-100 text-blue-800";
      case "observer": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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

  return (
    <PermissionGate action="user.view">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/users")}
            className="px-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to User Management
          </Button>
          <h1 className="text-3xl font-bold">User Details</h1>
        </div>

        <Card className="mb-6">
          <CardHeader className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>
                View detailed information about this user
              </CardDescription>
            </div>
            <PermissionGate action="user.edit">
              <div className="flex space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                  className="flex items-center gap-2"
                >
                  <Pencil size={16} />
                  Edit User
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete User
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete {user.name}'s account and remove their data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </PermissionGate>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.photoUrl} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <Badge className={getRoleBadgeClass(user.role)}>
                  {user.role}
                </Badge>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <div className="border border-input bg-background px-3 py-2 rounded-md text-base">
                      {user.name}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="border border-input bg-background px-3 py-2 rounded-md text-base">
                      {user.email}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <div className="border border-input bg-background px-3 py-2 rounded-md text-base">
                      {user.phone || "Not provided"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>User ID</Label>
                    <div className="border border-input bg-background px-3 py-2 rounded-md text-base">
                      {user.id}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <div className="border border-input bg-background px-3 py-2 rounded-md text-base min-h-[80px]">
                    {user.bio || "No bio provided"}
                  </div>
                </div>

                {/* Show camper feedback for all users who can view user profiles */}
                {user.role === "camper" && user.feedback && (
                  <div className="space-y-2">
                    <Label>Camper Feedback</Label>
                    <div className="border border-input bg-background px-3 py-2 rounded-md text-base min-h-[100px]">
                      {user.feedback}
                    </div>
                  </div>
                )}
                
                {/* Show admin comments only for users with admin permissions */}
                <PermissionGate action="admin.manage">
                  {user.comments && (
                    <div className="space-y-2">
                      <Label>Admin Comments</Label>
                      <div className="border border-input bg-background px-3 py-2 rounded-md text-base min-h-[100px]">
                        {user.comments}
                      </div>
                    </div>
                  )}
                </PermissionGate>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignments Section */}
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
                      const attendee = game.attendees.find(a => a.userId === id);
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
                              <Gamepad className="mr-2 h-4 w-4" /> Manage Game
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
                      const attendee = session.attendees.find(a => a.userId === id);
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
                              <BookOpen className="mr-2 h-4 w-4" /> Manage Session
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
      </div>
    </PermissionGate>
  );
};

export default UserDetail;
