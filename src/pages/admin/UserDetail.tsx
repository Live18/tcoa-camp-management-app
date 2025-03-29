import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
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
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { users, setUsers } = useUser();
  
  // Find the user by ID
  const user = users.find(user => user.id === id);

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
      </div>
    </PermissionGate>
  );
};

export default UserDetail;
