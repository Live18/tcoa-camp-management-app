
import React from "react";
import { User } from "@/types/userTypes";
import { toast } from "@/components/ui/use-toast";
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
import { ShieldCheck } from "lucide-react";

interface SuperAdminGrantDialogProps {
  user: User;
  onGrant: (userId: string) => void;
}

const SuperAdminGrantDialog: React.FC<SuperAdminGrantDialogProps> = ({
  user,
  onGrant
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <ShieldCheck className="h-4 w-4 mr-2" /> Grant Super Admin
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Grant Super Admin Status</AlertDialogTitle>
          <AlertDialogDescription>
            This will grant Super Admin privileges to {user.name}. 
            They will have full control over admin privileges.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onGrant(user.id)}
          >
            Grant Super Admin
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SuperAdminGrantDialog;
