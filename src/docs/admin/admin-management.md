
# Admin Management

## Overview

The admin management system provides a robust framework for controlling administrator access and privileges within the Basketball Camp platform. This system introduces a tiered admin structure with Super Admins and Regular Admins, each with specific capabilities.

## Admin Roles

### Super Admin
- Has complete control over the system, including all admin management functions
- Can grant and revoke admin privileges
- Can transfer Super Admin status to other admins
- Can grant Super Admin status to other admins (multiple Super Admins possible)
- Cannot be removed while they are the last Super Admin in the system

### Regular Admin
- Has management access to most system features
- Can manage users, locations, games, and sessions
- Cannot manage other admins (no access to admin privilege control)

## Component Structure

### Page Components
- `ManageAdmins.tsx`: Main page for admin management, utilizes smaller components for UI display and management
- `AdminEdit.tsx`: Page for editing admin details and permissions

### UI Components
- `AdminPageHeader.tsx`: Header component with navigation and action buttons for admin management pages
- `AdminList.tsx`: Displays the list of administrators in a table format
- `AdminTableRow.tsx`: Individual row for each admin in the admin list
- `SuperAdminInfoCard.tsx`: Displays information about Super Admin privileges
- `StatusBadge.tsx`: Badge component showing admin status (Super Admin or Regular Admin)
- `UserAvatar.tsx`: Reusable avatar component for user display

### Dialog Components
- `AdminLogs.tsx`: Modal displaying logs of admin privilege changes
- `AdminRemoveDialog.tsx`: Confirmation dialog for removing admin privileges
- `SuperAdminGrantDialog.tsx`: Confirmation dialog for granting Super Admin status
- `SuperAdminRevokeDialog.tsx`: Confirmation dialog for revoking Super Admin status
- `SuperAdminTransferDialog.tsx`: Confirmation dialog for transferring Super Admin status

### Empty States
- `EmptyAdminState.tsx`: Component displayed when no admins exist in the system

## Service Architecture

- `adminService.ts`: Entry point for admin-related services
- `logService.ts`: Handles creation of admin action logs
- `notificationHelpers.ts`: Service for sending notifications about admin changes
- `regularAdminService.ts`: Service for managing regular admin privileges
- `superAdminService.ts`: Service for managing Super Admin privileges

## Admin Management Workflows

### Admin Privilege Management

1. **Adding an Admin**
   - Navigate to Admin Management
   - Click "Add Admin" button
   - Select a user and confirm to grant admin privileges

2. **Removing an Admin**
   - Navigate to Admin Management
   - Find the admin in the list
   - Click "Actions" dropdown
   - Select "Remove Admin" and confirm

### Super Admin Management

1. **Transferring Super Admin Status**
   - Only Super Admins can perform this action
   - Navigate to Admin Management
   - Find the target admin in the list
   - Click "Actions" dropdown
   - Select "Transfer Super Admin" and confirm

2. **Granting Super Admin Status**
   - Only Super Admins can perform this action
   - Navigate to Admin Management
   - Find the target admin in the list
   - Click "Actions" dropdown
   - Select "Grant Super Admin" and confirm

3. **Revoking Super Admin Status**
   - Only Super Admins can perform this action
   - Cannot revoke the last Super Admin
   - Navigate to Admin Management
   - Find the target admin in the list
   - Click "Actions" dropdown
   - Select "Revoke Super Admin" and confirm

## Logging System

All admin privilege changes are logged with the following information:
- From user (who made the change)
- To user (who was affected)
- Action type (grant, revoke, transfer)
- Timestamp
- Status (completed)
