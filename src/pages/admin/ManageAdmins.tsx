
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { usePermission } from "@/contexts/PermissionContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeftRight,
  ClipboardList,
  Crown,
  Eye, 
  MoreHorizontal, 
  Pencil, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  ShieldX, 
  Trash2, 
  User,
  UserCog,
  UserMinus,
  UserPlus,
} from "lucide-react";

const ManageAdmins = () => {
  const navigate = useNavigate();
  const { users, currentUser, setUsers, transferSuperAdminStatus, grantSuperAdminStatus, revokeSuperAdminStatus, adminTransferLogs } = useUser();
  const { can } = usePermission();
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Filter only admin users
  const adminUsers = users.filter(user => user.isAdmin);
  
  // Format date helper
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };
  
  const handleRemoveAdmin = (id: string, name: string) => {
    // Update users list, removing the admin flag instead of deleting the user
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === id ? { ...user, isAdmin: false, role: "presenter", isSuperAdmin: false } : user
      )
    );
    
    toast({
      title: "Admin Removed",
      description: `${name} is no longer an admin.`,
    });
  };
  
  const handleGrantSuperAdmin = (userId: string, userName: string) => {
    try {
      grantSuperAdminStatus(userId);
      toast({
        title: "Success",
        description: `${userName} is now a Super Admin.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleRevokeSuperAdmin = (userId: string, userName: string) => {
    try {
      revokeSuperAdminStatus(userId);
      toast({
        title: "Super Admin Revoked",
        description: `${userName} is no longer a Super Admin.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleTransferSuperAdmin = (userId: string, userName: string) => {
    try {
      transferSuperAdminStatus(userId);
      toast({
        title: "Super Admin Transferred",
        description: `Super Admin privileges have been transferred to ${userName}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : userId === "system" ? "System" : "Unknown User";
  };

  const getActionText = (action: string) => {
    switch(action) {
      case 'super_admin_grant': return "was granted Super Admin status by";
      case 'super_admin_revoke': return "had Super Admin status revoked by";
      case 'admin_grant': return "was granted Admin status by";
      case 'admin_revoke': return "had Admin status revoked by";
      default: return "was modified by";
    }
  };

  return (
    <PermissionGate action="admin.manage">
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin")}
              className="mb-2 px-0"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Admin Management</h1>
            <p className="text-muted-foreground max-w-2xl mt-2">
              Manage administrator access and permissions. Super Admins have exclusive control over admin privileges.
            </p>
          </div>
          
          <div className="space-x-2 mt-4 md:mt-0 flex">
            <Button onClick={() => setIsLogOpen(true)} variant="outline">
              <ClipboardList className="h-4 w-4 mr-2" /> View Admin Logs
            </Button>
            <PermissionGate action="admin.manage_other_admins">
              <Button onClick={() => navigate("/admin/manage-admins/new")}>
                <UserPlus className="h-4 w-4 mr-2" /> Add Admin
              </Button>
            </PermissionGate>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-amber-500" /> 
              Super Admin Status
            </CardTitle>
            <CardDescription>
              Super Admins have exclusive control over admin privileges and cannot be demoted by regular admins.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm">
              <div className="flex items-start">
                <ShieldAlert className="h-5 w-5 mr-2 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Important Security Information</p>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-amber-700">
                    <li>Only Super Admins can grant or revoke admin privileges</li>
                    <li>The system must always maintain at least one Super Admin</li>
                    <li>Super Admin status changes are logged for security purposes</li>
                    <li>If you transfer your Super Admin status, you cannot regain it without another Super Admin's help</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Administrators</CardTitle>
            <CardDescription>
              Manage all admin users with system access
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                                        onClick={() => handleGrantSuperAdmin(user.id, user.name)}
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
                                        onClick={() => handleRevokeSuperAdmin(user.id, user.name)}
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
                                        onClick={() => handleTransferSuperAdmin(user.id, user.name)}
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
                    <UserPlus className="h-4 w-4 mr-2" /> Add Admin
                  </Button>
                </PermissionGate>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Admin Activity Log Dialog */}
        <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Admin Activity Log</DialogTitle>
              <DialogDescription>
                Record of all changes to admin privileges and status
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="h-[400px] rounded-md border p-4">
              {adminTransferLogs.length > 0 ? (
                <div className="space-y-4">
                  {adminTransferLogs.map((log) => (
                    <div key={log.id} className="rounded-lg bg-slate-50 p-3">
                      <div className="flex items-start">
                        <div className="mr-3 flex-shrink-0">
                          {log.action.includes('grant') ? (
                            <ShieldCheck className="h-5 w-5 text-green-500" />
                          ) : (
                            <ShieldX className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">{getUserName(log.toUserId)}</span>{" "}
                            {getActionText(log.action)}{" "}
                            <span className="font-medium">{getUserName(log.fromUserId)}</span>
                          </p>
                          <time className="text-xs text-muted-foreground">
                            {formatDate(new Date(log.timestamp))}
                          </time>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No activity logs found
                </p>
              )}
            </ScrollArea>
            
            <DialogFooter>
              <Button onClick={() => setIsLogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGate>
  );
};

export default ManageAdmins;
