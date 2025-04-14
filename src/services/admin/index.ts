
import { AdminTransferLog } from "@/types/userTypes";

// Re-export all admin services
export { createAdminTransferLog } from './logService';
export { transferSuperAdminStatus, grantSuperAdminStatus, revokeSuperAdminStatus } from './superAdminService';
export { removeAdminPrivileges, grantAdminPrivileges } from './regularAdminService';

// Re-export the AdminTransferLog type for convenience
export type { AdminTransferLog };
