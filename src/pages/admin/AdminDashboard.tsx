
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useMeeting } from "@/contexts/MeetingContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Upload, Bell, Mail, Brush } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { users, currentUser } = useUser();
  const { meetings } = useMeeting();

  if (!currentUser?.isAdmin) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage event attendees
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
              >
                Manage Users
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/admin/invitations")}
                className="w-full"
              >
                Send Invitations
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Meeting Management</CardTitle>
              <CardDescription>
                Organize and schedule meetings
              </CardDescription>
            </div>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-2xl font-bold">{meetings.length}</div>
            <p className="text-muted-foreground">Active meetings</p>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col space-y-2 w-full">
              <Button 
                onClick={() => navigate("/admin/meetings")}
                className="w-full"
              >
                Manage Meetings
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/admin/meetings/new")}
                className="w-full"
              >
                Create Meeting
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Data Import</CardTitle>
              <CardDescription>
                Import user and meeting data
              </CardDescription>
            </div>
            <Upload className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Upload spreadsheets to import user and meeting data
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline"
              onClick={() => navigate("/admin/import")}
              className="w-full"
            >
              Import Data
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Send updates to attendees
              </CardDescription>
            </div>
            <Bell className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Send push notifications to meeting attendees
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline"
              onClick={() => navigate("/admin/notifications")}
              className="w-full"
            >
              Send Notifications
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Invitations</CardTitle>
              <CardDescription>
                Invite new attendees
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
            >
              Manage Invitations
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Branding</CardTitle>
              <CardDescription>
                Customize app appearance
              </CardDescription>
            </div>
            <Brush className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Upload and manage branding assets
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline"
              onClick={() => navigate("/admin/branding")}
              className="w-full"
            >
              Manage Branding
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
