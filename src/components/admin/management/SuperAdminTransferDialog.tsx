
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
import { ArrowLeftRight } from "lucide-react";

interface SuperAdminTransferDialogProps {
  user: User;
  onTransfer: (userId: string) => void;
}

const SuperAdminTransferDialog: React.FC<SuperAdminTransferDialogProps> = ({
  user,
  onTransfer
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <ArrowLeftRight className="h-4 w-4 mr-2" /> Transfer Super Admin
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Transfer Super Admin Status</AlertDialogTitle>
          <AlertDialogDescription>
            This will transfer your Super Admin status to {user.name} and you will 
            become a regular admin. This action is irreversible unless another Super Admin
            grants you the status again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onTransfer(user.id)}
            className="bg-amber-600 text-white hover:bg-amber-700"
          >
            Transfer Super Admin
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SuperAdminTransferDialog;
