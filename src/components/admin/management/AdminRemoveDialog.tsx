
import React from "react";
import { User } from "@/types/userTypes";
import { toast } from "@/components/ui/use-toast";
import { sendNotification } from "@/utils/notificationService";
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UserMinus } from "lucide-react";

interface AdminRemoveDialogProps {
  user: User;
  currentUser: User | null;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const AdminRemoveDialog: React.FC<AdminRemoveDialogProps> = ({
  user,
  currentUser,
  users,
  setUsers,
}) => {
  const handleRemoveAdmin = (id: string, name: string) => {
    // Get the user being demoted
    const userToRemove = users.find(u => u.id === id);
    
    if (!userToRemove) {
      toast({
        title: "Error",
        description: "User not found.",
        variant: "destructive",
      });
      return;
    }
    
    // Update users list, removing the admin flag instead of deleting the user
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === id ? { ...u, isAdmin: false, role: "presenter", isSuperAdmin: false } : u
      )
    );
    
    // Send notification to the demoted admin based on their preference
    if (userToRemove.notificationPreference) {
      sendNotification({
        title: "Admin Access Removed",
        message: `Your administrator access to the Basketball Camp platform has been revoked. You now have presenter privileges.`,
        user: userToRemove
      });
    }
    
    toast({
      title: "Admin Removed",
      description: `${name} is no longer an admin.`,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
          <UserMinus className="h-4 w-4 mr-2" /> Remove Admin
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove admin privileges from {user.name}.
            This action can be reversed, but the user will no longer have admin access.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleRemoveAdmin(user.id, user.name)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Remove Admin
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdminRemoveDialog;
