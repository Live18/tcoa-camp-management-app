
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { Button } from "@/components/ui/button";
import { AdminCreateForm } from "@/components/admin/create/AdminCreateForm";

const AdminCreate = () => {
  const navigate = useNavigate();
  const { users, setUsers } = useUser();

  return (
    <PermissionGate action="admin.manage">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/manage-admins")}
            className="px-0"
          >
            ← Back to Admin Management
          </Button>
          <h1 className="text-3xl font-bold">Add New Admin</h1>
        </div>

        <AdminCreateForm users={users} setUsers={setUsers} />
      </div>
    </PermissionGate>
  );
};

export default AdminCreate;
