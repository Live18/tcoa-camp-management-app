
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, UserPlus } from "lucide-react";

// Import our new components
import AdminList from "@/components/admin/management/AdminList";
import AdminLogs from "@/components/admin/management/AdminLogs";
import SuperAdminInfoCard from "@/components/admin/management/SuperAdminInfoCard";

const ManageAdmins = () => {
  const navigate = useNavigate();
  const { users, adminTransferLogs } = useUser();
  const [isLogOpen, setIsLogOpen] = useState(false);

  // Filter only admin users
  const adminUsers = users.filter(user => user.isAdmin);

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
        
        {/* Super Admin Information Card */}
        <SuperAdminInfoCard />
        
        {/* Admin Users Card */}
        <Card>
          <CardHeader>
            <CardTitle>Administrators</CardTitle>
            <CardDescription>
              Manage all admin users with system access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminList adminUsers={adminUsers} />
          </CardContent>
        </Card>
        
        {/* Admin Activity Log Dialog */}
        <AdminLogs 
          isOpen={isLogOpen}
          onOpenChange={setIsLogOpen}
          adminTransferLogs={adminTransferLogs}
          users={users}
        />
      </div>
    </PermissionGate>
  );
};

export default ManageAdmins;
