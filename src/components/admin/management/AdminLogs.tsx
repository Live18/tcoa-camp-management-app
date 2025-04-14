
import React from "react";
import { AdminTransferLog, User } from "@/contexts/UserContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, ShieldX } from "lucide-react";

interface AdminLogsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  adminTransferLogs: AdminTransferLog[];
  users: User[];
}

const AdminLogs: React.FC<AdminLogsProps> = ({
  isOpen,
  onOpenChange,
  adminTransferLogs,
  users,
}) => {
  // Format date helper
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date(date));
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                        {formatDate(log.timestamp)}
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
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLogs;
