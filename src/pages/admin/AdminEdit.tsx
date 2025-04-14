
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdminHeader from "@/components/admin/edit/AdminHeader";
import AdminEditForm from "@/components/admin/edit/AdminEditForm";
import AdminNotFound from "@/components/admin/edit/AdminNotFound";

type FormData = {
  comments?: string;
};

const AdminEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { users, setUsers } = useUser();
  
  // Find the admin user
  const adminUser = users.find(user => user.id === id && user.isAdmin);

  const handleFormSubmit = (data: FormData) => {
    if (!adminUser) {
      toast({
        title: "Error",
        description: "Admin user not found",
        variant: "destructive",
      });
      return;
    }

    // Update the user
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === id
          ? { ...user, comments: data.comments }
          : user
      )
    );
    
    toast({
      title: "Admin Updated",
      description: `${adminUser.name}'s admin information has been updated.`,
    });

    navigate("/admin/manage-admins");
  };

  if (!adminUser) {
    return <AdminNotFound />;
  }

  return (
    <PermissionGate action="admin.manage">
      <div className="container mx-auto py-6">
        <AdminHeader adminUser={adminUser} />

        <Card>
          <CardHeader>
            <CardTitle>Edit Admin User</CardTitle>
            <CardDescription>
              Modify admin details and permissions
            </CardDescription>
          </CardHeader>
          <AdminEditForm 
            adminUser={adminUser}
            onSave={handleFormSubmit}
            onCancel={() => navigate("/admin/manage-admins")}
          />
        </Card>
      </div>
    </PermissionGate>
  );
};

export default AdminEdit;
