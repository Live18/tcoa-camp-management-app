
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HomeIcon, Calendar, Users, Gamepad, BookOpen, Bell } from "lucide-react";

const Home = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {currentUser?.name}!</h1>
        <p className="text-muted-foreground">
          Basketball Camp Management Dashboard
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>My Profile</CardTitle>
              <CardDescription>View and update your profile</CardDescription>
            </div>
            <HomeIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {currentUser?.role.charAt(0).toUpperCase() + currentUser?.role.slice(1)} account
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/profile")} variant="outline" className="w-full">
              View Profile
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Upcoming Games</CardTitle>
              <CardDescription>View upcoming basketball games</CardDescription>
            </div>
            <Gamepad className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Check the schedule and sign up for games
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/games")} variant="outline" className="w-full">
              View Games
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Classroom Sessions</CardTitle>
              <CardDescription>View classroom sessions and materials</CardDescription>
            </div>
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Access learning materials and classroom schedules
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/classroom-sessions")} variant="outline" className="w-full">
              View Sessions
            </Button>
          </CardFooter>
        </Card>

        {currentUser?.isAdmin && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>Manage camp activities</CardDescription>
              </div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access admin controls and management tools
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate("/admin")} className="w-full">
                Open Admin Dashboard
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Home;
