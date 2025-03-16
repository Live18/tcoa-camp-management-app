
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useMeeting } from "@/contexts/MeetingContext";
import { Calendar, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { meetings } = useMeeting();

  const upcomingMeetings = meetings
    .filter(meeting => new Date(meeting.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {currentUser ? (
        <>
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Welcome, {currentUser.name}</CardTitle>
                <CardDescription>
                  {currentUser.isAdmin 
                    ? "Manage your events and users from the admin dashboard" 
                    : "View your upcoming meetings and profile information"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <Button 
                    onClick={() => navigate("/profile")}
                    className="w-full md:w-auto"
                  >
                    View Profile
                  </Button>
                  {currentUser.isAdmin && (
                    <Button 
                      onClick={() => navigate("/admin")}
                      className="w-full md:w-auto"
                    >
                      Admin Dashboard
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Upcoming Meetings</CardTitle>
                  <CardDescription>
                    Your scheduled events
                  </CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {upcomingMeetings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingMeetings.map(meeting => (
                      <div key={meeting.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <h4 className="font-medium">{meeting.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(meeting.date).toLocaleDateString()} at {new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => navigate(`/meetings/${meeting.id}`)}
                          size="sm"
                        >
                          View
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate("/meetings")}
                      className="w-full mt-2"
                    >
                      View All Meetings
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No upcoming meetings</p>
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate("/meetings")}
                      className="mt-2"
                    >
                      View All Meetings
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {currentUser.isAdmin && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Quick access to user management tools
                  </CardDescription>
                </div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
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
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/admin/meetings")}
                    className="w-full"
                  >
                    Manage Meetings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>EventFellowship</CardTitle>
            <CardDescription>
              Please log in to access your event management account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/login")}>Login</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;
