import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useGame } from "@/contexts/GameContext";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { useLocation } from "@/contexts/LocationContext";
import { usePermission } from "@/contexts/PermissionContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { useRoleCheck } from "@/hooks/useRoleCheck";
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
import { Users, Gamepad, BookOpen, MapPin, Bell, Mail, UserPlus } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { users } = useUser();
  const { games, getUnpublishedAttendees: getUnpublishedGameAttendees } = useGame();
  const { sessions, getUnpublishedAttendees: getUnpublishedSessionAttendees } = useClassroomSession();
  const { locations } = useLocation();
  const { can } = usePermission();
  const { isAdmin } = useRoleCheck();

  const unpublishedGameAttendees = getUnpublishedGameAttendees();
  const unpublishedSessionAttendees = getUnpublishedSessionAttendees();
  const totalUnpublishedAttendees = unpublishedGameAttendees + unpublishedSessionAttendees;

  return (
    <PermissionGate
      action="user.view"
      redirectTo="/"
    >
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          {!isAdmin && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
              View Only Mode
            </Badge>
          )}
        </div>

        {totalUnpublishedAttendees > 0 && (
          <Card className="mb-6 border-yellow-300 bg-yellow-50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-yellow-800">Unpublished Assignments</h3>
                  <p className="text-sm text-yellow-700">
                    You have {totalUnpublishedAttendees} unpublished assignments
                    ({unpublishedGameAttendees} for games, {unpublishedSessionAttendees} for sessions)
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="bg-white border-yellow-300 text-yellow-800"
                  onClick={() => navigate("/admin/assignments")}
                >
                  Review Assignments
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {can("user.view") && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage camp users
                  </CardDescription>
                </div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-muted-foreground">Registered users</p>
              </CardContent>
              <CardFooter>
                <div className="flex flex-col space-y-2 w-full">
                  <Button 
                    onClick={() => navigate("/admin/users")}
                    className="w-full"
                    variant={isAdmin ? "default" : "outline"}
                    disabled={!can("user.edit")}
                  >
                    {isAdmin ? "Manage Users" : "View Users"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/admin/invitations")}
                    className="w-full"
                    disabled={!can("invitation.send")}
                  >
                    Send Invitations
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}

          {can("location.view") && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Location Management</CardTitle>
                  <CardDescription>
                    Manage camp locations
                  </CardDescription>
                </div>
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-2xl font-bold">{locations.length}</div>
                <p className="text-muted-foreground">Active locations</p>
              </CardContent>
              <CardFooter>
                <div className="flex flex-col space-y-2 w-full">
                  <Button 
                    onClick={() => navigate("/admin/locations")}
                    className="w-full"
                    variant={isAdmin ? "default" : "outline"}
                    disabled={!can("location.edit")}
                  >
                    {isAdmin ? "Manage Locations" : "View Locations"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/admin/locations/new")}
                    className="w-full"
                    disabled={!can("location.create")}
                  >
                    Add Location
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}

          {can("game.view") && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Game Management</CardTitle>
                  <CardDescription>
                    Organize and schedule games
                  </CardDescription>
                </div>
                <Gamepad className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-2xl font-bold">{games.length}</div>
                <p className="text-muted-foreground">Active games</p>
                {unpublishedGameAttendees > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800 mt-2">
                    {unpublishedGameAttendees} unpublished assignments
                  </Badge>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex flex-col space-y-2 w-full">
                  <Button 
                    onClick={() => navigate("/admin/games")}
                    className="w-full"
                    variant={isAdmin ? "default" : "outline"}
                    disabled={!can("game.edit")}
                  >
                    {isAdmin ? "Manage Games" : "View Games"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/admin/games/new")}
                    className="w-full"
                    disabled={!can("game.create")}
                  >
                    Create Game
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}

          {can("session.view") && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Classroom Sessions</CardTitle>
                  <CardDescription>
                    Manage classroom sessions
                  </CardDescription>
                </div>
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-2xl font-bold">{sessions.length}</div>
                <p className="text-muted-foreground">Active sessions</p>
                {unpublishedSessionAttendees > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800 mt-2">
                    {unpublishedSessionAttendees} unpublished assignments
                  </Badge>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex flex-col space-y-2 w-full">
                  <Button 
                    onClick={() => navigate("/admin/sessions")}
                    className="w-full"
                    variant={isAdmin ? "default" : "outline"}
                    disabled={!can("session.edit")}
                  >
                    {isAdmin ? "Manage Sessions" : "View Sessions"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/admin/sessions/new")}
                    className="w-full"
                    disabled={!can("session.create")}
                  >
                    Create Session
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}

          {can("admin.manage") && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Admin Management</CardTitle>
                  <CardDescription>
                    Manage admin accounts
                  </CardDescription>
                </div>
                <UserPlus className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-2xl font-bold">
                  {users.filter(u => u.isAdmin).length}
                </div>
                <p className="text-muted-foreground">Admin users</p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate("/admin/manage-admins")}
                  className="w-full"
                  disabled={!can("admin.manage")}
                >
                  Manage Admins
                </Button>
              </CardFooter>
            </Card>
          )}

          {can("notification.send") && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Send updates to users
                  </CardDescription>
                </div>
                <Bell className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Send notifications to camp participants
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/admin/notifications")}
                  className="w-full"
                  disabled={!can("notification.send")}
                >
                  Send Notifications
                </Button>
              </CardFooter>
            </Card>
          )}

          {can("invitation.send") && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Invitations</CardTitle>
                  <CardDescription>
                    Invite new users
                  </CardDescription>
                </div>
                <Mail className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Send email invitations to new users
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/admin/invitations")}
                  className="w-full"
                  disabled={!can("invitation.send")}
                >
                  Manage Invitations
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </PermissionGate>
  );
};

export default AdminDashboard;
