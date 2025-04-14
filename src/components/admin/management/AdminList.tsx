
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser, User } from "@/contexts/UserContext";
import { usePermission } from "@/contexts/PermissionContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sendNotification } from "@/utils/notificationService";
import {
  ArrowLeftRight,
  Crown,
  Eye,
  MoreHorizontal,
  Pencil,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  UserMinus,
  UserPlus,
} from "lucide-react";

interface AdminListProps {
  adminUsers: User[];
}

const AdminList: React.FC<AdminListProps> = ({ adminUsers }) => {
  const navigate = useNavigate();
  const { currentUser, users, setUsers, transferSuperAdminStatus, grantSuperAdminStatus, revokeSuperAdminStatus } = useUser();
  const { can } = usePermission();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const handleRemoveAdmin = (id: string, name: string) => {
    // Get the user being demoted
    const user = users.find(u => u.id === id);
    
    if (!user) {
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
    if (user.notificationPreference) {
      sendNotification({
        title: "Admin Access Removed",
        message: `Your administrator access to the Basketball Camp platform has been revoked. You now have presenter privileges.`,
        user: user
      });
    }
    
    toast({
      title: "Admin Removed",
      description: `${name} is no longer an admin.`,
    });
  };

  // Updated to use the context methods directly
  const handleGrantSuperAdmin = (userId: string) => {
    try {
      grantSuperAdminStatus(userId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleRevokeSuperAdmin = (userId: string) => {
    try {
      revokeSuperAdminStatus(userId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleTransferSuperAdmin = (userId: string) => {
    try {
      transferSuperAdminStatus(userId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {adminUsers.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.photoUrl} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <ShieldAlert className="h-3 w-3 mr-1" /> Admin
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || "N/A"}</TableCell>
                <TableCell>
                  {user.isSuperAdmin ? (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                      <Crown className="h-3 w-3 mr-1" /> Super Admin
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200">
                      <Shield className="h-3 w-3 mr-1" /> Regular Admin
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
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
                        
                        {!user.isSuperAdmin && (
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
                                  onClick={() => handleGrantSuperAdmin(user.id)}
                                >
                                  Grant Super Admin
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        
                        {user.isSuperAdmin && currentUser?.id !== user.id && (
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
                                  onClick={() => handleRevokeSuperAdmin(user.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Revoke Super Admin
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        
                        {user.id !== currentUser?.id && (
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
                                  onClick={() => handleTransferSuperAdmin(user.id)}
                                  className="bg-amber-600 text-white hover:bg-amber-700"
                                >
                                  Transfer Super Admin
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        
                        <DropdownMenuSeparator />
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
                      </PermissionGate>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No admin users found</p>
          <PermissionGate action="admin.manage_other_admins">
            <Button onClick={() => navigate("/admin/manage-admins/new")} className="mt-4">
              <ShieldPlus className="h-4 w-4 mr-2" /> Add Admin
            </Button>
          </PermissionGate>
        </div>
      )}
    </>
  );
};

export default AdminList;
