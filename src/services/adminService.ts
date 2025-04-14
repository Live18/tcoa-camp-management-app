
// This file serves as the main entry point for all admin-related services
// It re-exports everything from the admin submodule for backward compatibility

export * from './admin';

// Export types directly to avoid extra imports for consumers
export type { AdminTransferLog } from '@/types/userTypes';
