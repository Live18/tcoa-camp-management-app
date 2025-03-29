
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
    // Update the user to make them an admin
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === data.userId
          ? { ...user, isAdmin: true, role: "admin", comments: data.comments || user.comments }
          : user
      )
    );

    // Get the user's name for the toast message
    const user = users.find(u => u.id === data.userId);
    
    toast({
      title: "Admin Added",
      description: `${user?.name} has been granted admin privileges.`,
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
