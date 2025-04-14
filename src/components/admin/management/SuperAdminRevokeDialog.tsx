
import React from "react";
import { User } from "@/types/userTypes";
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
import { ShieldX } from "lucide-react";

interface SuperAdminRevokeDialogProps {
  user: User;
  onRevoke: (userId: string) => void;
}

const SuperAdminRevokeDialog: React.FC<SuperAdminRevokeDialogProps> = ({
  user,
  onRevoke
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <ShieldX className="h-4 w-4 mr-2" /> Revoke Super Admin
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke Super Admin Status</AlertDialogTitle>
          <AlertDialogDescription>
            This will revoke Super Admin privileges from {user.name}. 
            Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onRevoke(user.id)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Revoke Super Admin
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SuperAdminRevokeDialog;
