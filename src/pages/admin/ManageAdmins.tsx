
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

// Import our components
import AdminList from "@/components/admin/management/AdminList";
import AdminLogs from "@/components/admin/management/AdminLogs";
import SuperAdminInfoCard from "@/components/admin/management/SuperAdminInfoCard";
import AdminPageHeader from "@/components/admin/management/AdminPageHeader";

const ManageAdmins = () => {
  const navigate = useNavigate();
  const { users, adminTransferLogs } = useUser();
  const [isLogOpen, setIsLogOpen] = useState(false);

  // Filter only admin users
  const adminUsers = users.filter(user => user.isAdmin);

  return (
    <PermissionGate action="admin.manage">
      <div className="container mx-auto py-6">
        {/* Admin Page Header with Back Button and Action Buttons */}
        <AdminPageHeader 
          onViewLogs={() => setIsLogOpen(true)} 
          onAddAdmin={() => navigate("/admin/manage-admins/new")} 
        />
        
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
