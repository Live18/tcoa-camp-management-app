
import React from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { sendNotification } from "@/utils/notificationService";

const formSchema = z.object({
  userId: z.string().min(1, "Please select a user"),
  comments: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const AdminCreate = () => {
  const navigate = useNavigate();
  const { users, setUsers } = useUser();
  
  // Get only non-admin users for the dropdown
  const nonAdminUsers = users.filter(user => !user.isAdmin);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      comments: "",
    },
  });

  const onSubmit = (data: FormData) => {
    // Get the user being promoted to admin
    const user = users.find(u => u.id === data.userId);
    
    if (!user) {
      toast({
        title: "Error",
        description: "User not found.",
        variant: "destructive",
      });
      return;
    }
    
    // Update the user to make them an admin
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === data.userId
          ? { ...u, isAdmin: true, role: "admin", comments: data.comments || u.comments }
          : u
      )
    );
    
    // Send notification to the new admin based on their preference
    if (user.notificationPreference) {
      const notificationTitle = "Admin Access Granted";
      const notificationMessage = `You have been granted administrator access to the Basketball Camp platform. You now have full administrative privileges.`;
      
      const notificationSent = sendNotification({
        title: notificationTitle,
        message: notificationMessage,
        user: user
      });
      
      if (notificationSent) {
        toast({
          title: "Notification Sent",
          description: `A notification has been sent to ${user.name} via ${user.notificationPreference}.`,
        });
      } else {
        toast({
          title: "Notification Failed",
          description: `Could not send notification to ${user.name}. Please inform them manually.`,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "No Notification Sent",
        description: `${user.name} has no notification preferences set. Please inform them manually.`,
        variant: "warning",
      });
    }
    
    toast({
      title: "Admin Added",
      description: `${user.name} has been granted admin privileges.`,
    });

    navigate("/admin/manage-admins");
  };

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
          <h1 className="text-3xl font-bold">Add New Admin</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Grant Admin Privileges</CardTitle>
            <CardDescription>
              Select a user to promote to administrator status
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {nonAdminUsers.length > 0 ? (
                            nonAdminUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name} ({user.email})
                                {user.notificationPreference && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    • {user.notificationPreference} notifications enabled
                                  </span>
                                )}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No eligible users found
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This user will be granted full administrator privileges
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Add any notes about this admin assignment" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Add any notes or reasons for granting admin access
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  <UserPlus className="h-4 w-4 mr-2" /> Grant Admin Access
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </PermissionGate>
  );
};

export default AdminCreate;
