
import React from "react";
import { useUser, User } from "@/contexts/UserContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminTableRow from "./AdminTableRow";
import EmptyAdminState from "./EmptyAdminState";

interface AdminListProps {
  adminUsers: User[];
}

const AdminList: React.FC<AdminListProps> = ({ adminUsers }) => {
  if (adminUsers.length === 0) {
    return <EmptyAdminState />;
  }

  return (
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
          <AdminTableRow key={user.id} user={user} />
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminList;
