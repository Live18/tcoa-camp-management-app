
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser, UserRole } from "@/contexts/UserContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  role: z.enum(["camper", "observer", "presenter", "admin"]),
  comments: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const UserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { users, setUsers } = useUser();
  
  // Find the user by ID
  const user = users.find(user => user.id === id);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      role: user?.role || "camper",
      comments: user?.comments || "",
    },
  });

  // Update form when user is found
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        bio: user.bio || "",
        role: user.role,
        comments: user.comments || "",
      });
    }
  }, [user, form]);

  const onSubmit = (data: FormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive",
      });
      return;
    }

    // Update the user
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === id
          ? {
              ...u,
              name: data.name,
              email: data.email,
              phone: data.phone,
              bio: data.bio,
              role: data.role as UserRole,
              isAdmin: data.role === "admin",
              comments: data.comments,
            }
          : u
      )
    );
    
    toast({
      title: "User Updated",
      description: `${data.name}'s profile has been updated successfully.`,
    });

    navigate(`/admin/users/${id}`);
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

  return (
    <PermissionGate action="user.edit">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/admin/users/${id}`)}
            className="px-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to User Details
          </Button>
          <h1 className="text-3xl font-bold">Edit User</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit User Profile</CardTitle>
            <CardDescription>Update user information and settings</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4 mb-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.photoUrl} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="camper">Camper</SelectItem>
                            <SelectItem value="observer">Observer</SelectItem>
                            <SelectItem value="presenter">Presenter</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          User role determines permissions in the system
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="User biography" 
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Comments</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Administrative notes about this user" 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        These comments are only visible to administrators
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {user.role === "camper" && user.feedback && (
                  <div className="space-y-2">
                    <Label>Camper Feedback (Read Only)</Label>
                    <Textarea 
                      value={user.feedback} 
                      readOnly 
                      rows={4}
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">
                      Feedback submitted by the camper
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(`/admin/users/${id}`)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </PermissionGate>
  );
};

export default UserEdit;
