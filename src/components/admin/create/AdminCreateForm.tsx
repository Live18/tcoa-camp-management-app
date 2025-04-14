
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { User } from "@/contexts/UserContext";
import { toast } from "@/components/ui/use-toast";
import { sendNotification } from "@/utils/notificationService";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserSelectField } from "./UserSelectField";
import { CommentsField } from "./CommentsField";

const formSchema = z.object({
  userId: z.string().min(1, "Please select a user"),
  comments: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AdminCreateFormProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const AdminCreateForm: React.FC<AdminCreateFormProps> = ({ users, setUsers }) => {
  const navigate = useNavigate();
  
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
        variant: "default",
      });
    }
    
    toast({
      title: "Admin Added",
      description: `${user.name} has been granted admin privileges.`,
    });

    navigate("/admin/manage-admins");
  };

  return (
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
            <UserSelectField control={form.control} nonAdminUsers={nonAdminUsers} />
            <CommentsField control={form.control} />
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
  );
};
