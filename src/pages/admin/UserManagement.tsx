
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { usePermission } from "@/contexts/PermissionContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import UserTable from "@/components/admin/user/UserTable";
import UserPageHeader from "@/components/admin/user/UserPageHeader";

const UserManagement = () => {
  const navigate = useNavigate();
  const { users } = useUser();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PermissionGate 
      action="user.view"
      redirectTo="/"
    >
      <div className="container mx-auto py-6">
        <UserPageHeader 
          title="User Management"
          onBackClick={() => navigate("/admin")}
        />

        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or role..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <UserTable users={filteredUsers} />
      </div>
    </PermissionGate>
  );
};

export default UserManagement;
