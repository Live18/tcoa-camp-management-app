
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { usePermission } from "@/contexts/PermissionContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { User } from "@/types/userTypes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Pencil,
} from "lucide-react";

// Import our refactored dialog components
import AdminRemoveDialog from "./AdminRemoveDialog";
import SuperAdminGrantDialog from "./SuperAdminGrantDialog";
import SuperAdminRevokeDialog from "./SuperAdminRevokeDialog";
import SuperAdminTransferDialog from "./SuperAdminTransferDialog";

interface AdminActionsProps {
  user: User;
}

const AdminActions: React.FC<AdminActionsProps> = ({ user }) => {
  const navigate = useNavigate();
  const { currentUser, users, setUsers, transferSuperAdminStatus, grantSuperAdminStatus, revokeSuperAdminStatus } = useUser();
  
  // Handler functions for super admin operations
  const handleGrantSuperAdmin = (userId: string) => {
    try {
      grantSuperAdminStatus(userId);
    } catch (error: any) {
      console.error("Error granting super admin status:", error);
    }
  };
  
  const handleRevokeSuperAdmin = (userId: string) => {
    try {
      revokeSuperAdminStatus(userId);
    } catch (error: any) {
      console.error("Error revoking super admin status:", error);
    }
  };
  
  const handleTransferSuperAdmin = (userId: string) => {
    try {
      transferSuperAdminStatus(userId);
    } catch (error: any) {
      console.error("Error transferring super admin status:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}>
          <Eye className="h-4 w-4 mr-2" /> View Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`/admin/manage-admins/edit/${user.id}`)}>
          <Pencil className="h-4 w-4 mr-2" /> Edit Admin
        </DropdownMenuItem>
        
        <PermissionGate action="admin.manage_other_admins">
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Super Admin Actions</DropdownMenuLabel>
          
          {/* Super Admin Grant Dialog - show only if user is not already a Super Admin */}
          {!user.isSuperAdmin && (
            <SuperAdminGrantDialog
              user={user}
              onGrant={handleGrantSuperAdmin}
            />
          )}
          
          {/* Super Admin Revoke Dialog - show only if user is a Super Admin and not the current user */}
          {user.isSuperAdmin && currentUser?.id !== user.id && (
            <SuperAdminRevokeDialog
              user={user}
              onRevoke={handleRevokeSuperAdmin}
            />
          )}
          
          {/* Super Admin Transfer Dialog - show if not the current user */}
          {user.id !== currentUser?.id && (
            <SuperAdminTransferDialog
              user={user}
              onTransfer={handleTransferSuperAdmin}
            />
          )}
          
          <DropdownMenuSeparator />
          
          {/* Admin Remove Dialog */}
          <AdminRemoveDialog
            user={user}
            currentUser={currentUser}
            users={users}
            setUsers={setUsers}
          />
        </PermissionGate>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminActions;
