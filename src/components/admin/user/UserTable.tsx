
import React from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/types/userTypes";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const navigate = useNavigate();
  
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "presenter": return "bg-blue-100 text-blue-800";
      case "evaluator": return "bg-purple-100 text-purple-800";
      case "observer": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary">
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-foreground">User</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-foreground">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-foreground">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-foreground">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.photoUrl} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {user.email}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge className={getRoleBadgeClass(user.role)}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {user.phone || "N/A"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <PermissionGate action="user.view">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                      >
                        View User
                      </Button>
                    </PermissionGate>
                    <PermissionGate action="user.edit">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                      >
                        Edit
                      </Button>
                    </PermissionGate>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No users found</p>
        </div>
      )}
    </div>
  );
};

export default UserTable;
