
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { User } from "@/types/userTypes";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import AdminActions from "./AdminActions";

interface AdminTableRowProps {
  user: User;
}

const AdminTableRow: React.FC<AdminTableRowProps> = ({ user }) => {
  return (
    <TableRow>
      <TableCell>
        <UserAvatar 
          name={user.name}
          photoUrl={user.photoUrl}
        />
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phone || "N/A"}</TableCell>
      <TableCell>
        <StatusBadge isSuperAdmin={user.isSuperAdmin || false} />
      </TableCell>
      <TableCell>
        <AdminActions user={user} />
      </TableCell>
    </TableRow>
  );
};

export default AdminTableRow;
