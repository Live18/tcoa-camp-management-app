
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
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
import { UserPlus, ShieldAlert } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  comments: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const AdminEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { users, setUsers } = useUser();
  
  // Find the admin user
  const adminUser = users.find(user => user.id === id && user.isAdmin);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comments: adminUser?.comments || "",
    },
  });

  // Update form when user is found
  useEffect(() => {
    if (adminUser) {
      form.reset({
        comments: adminUser.comments || "",
      });
    }
  }, [adminUser, form]);

  const onSubmit = (data: FormData) => {
    if (!adminUser) {
      toast({
        title: "Error",
        description: "Admin user not found",
        variant: "destructive",
      });
      return;
    }

    // Update the user
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === id
          ? { ...user, comments: data.comments }
          : user
      )
    );
    
    toast({
      title: "Admin Updated",
      description: `${adminUser.name}'s admin information has been updated.`,
    });

    navigate("/admin/manage-admins");
  };

  // Function to get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  if (!adminUser) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/manage-admins")}
            className="px-0"
          >
            ← Back to Admin Management
          </Button>
        </div>
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-center">User Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">The admin user you're looking for doesn't exist or isn't an admin.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate("/admin/manage-admins")}>
              Return to Admin Management
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <PermissionGate action="admin.manage">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/manage-admins")}
            className="px-0"
          >
            ← Back to Admin Management
          </Button>
          <h1 className="text-3xl font-bold">Edit Admin</h1>
        </div>

        <Card>
          <CardHeader className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Edit Admin User</CardTitle>
              <CardDescription>
                Modify admin details and permissions
              </CardDescription>
            </div>
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src={adminUser.photoUrl} alt={adminUser.name} />
                <AvatarFallback>{getInitials(adminUser.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{adminUser.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center">
                  <ShieldAlert className="h-3 w-3 mr-1" /> Admin
                </p>
              </div>
            </div>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground">Email</label>
                        <Input value={adminUser.email} disabled />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Phone</label>
                        <Input value={adminUser.phone || "Not provided"} disabled />
                      </div>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add any notes about this admin user" 
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Add information about admin responsibilities or area of focus
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/admin/manage-admins")}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </PermissionGate>
  );
};

export default AdminEdit;
