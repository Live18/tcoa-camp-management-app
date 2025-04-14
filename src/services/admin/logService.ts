
import { AdminTransferLog } from "@/types/userTypes";

/**
 * Function to create a log entry for admin actions
 */
export const createAdminTransferLog = (
  fromUserId: string, 
  toUserId: string, 
  action: AdminTransferLog['action'],
  setAdminTransferLogs: React.Dispatch<React.SetStateAction<AdminTransferLog[]>>
): AdminTransferLog => {
  const newLog: AdminTransferLog = {
    id: Date.now().toString(),
    fromUserId,
    toUserId,
    timestamp: new Date(),
    action,
    status: 'completed'
  };
  
  setAdminTransferLogs(prev => [newLog, ...prev]);
  return newLog;
};
