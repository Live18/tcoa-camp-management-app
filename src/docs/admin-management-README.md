
# Admin & User Management System Documentation

## Overview

This document provides a comprehensive guide to the admin and user management system. The system is built with a component-based architecture that separates concerns and promotes reusability. Super Admins have exclusive control over managing other administrators, while regular admins can manage users and other system aspects.

## Component Structure

### Admin Management Components

#### Page Components
- `ManageAdmins.tsx`: Main page for admin management, utilizes smaller components for UI display and management
- `AdminEdit.tsx`: Page for editing admin details and permissions

#### UI Components
- `AdminPageHeader.tsx`: Header component with navigation and action buttons for admin management pages
- `AdminList.tsx`: Displays the list of administrators in a table format
- `AdminTableRow.tsx`: Individual row for each admin in the admin list
- `SuperAdminInfoCard.tsx`: Displays information about Super Admin privileges
- `StatusBadge.tsx`: Badge component showing admin status (Super Admin or Regular Admin)
- `UserAvatar.tsx`: Reusable avatar component for user display

#### Dialog Components
- `AdminLogs.tsx`: Modal displaying logs of admin privilege changes
- `AdminRemoveDialog.tsx`: Confirmation dialog for removing admin privileges
- `SuperAdminGrantDialog.tsx`: Confirmation dialog for granting Super Admin status
- `SuperAdminRevokeDialog.tsx`: Confirmation dialog for revoking Super Admin status
- `SuperAdminTransferDialog.tsx`: Confirmation dialog for transferring Super Admin status

#### Empty States
- `EmptyAdminState.tsx`: Component displayed when no admins exist in the system

### User Management Components

- `UserManagement.tsx`: Main page for user management
- `UserPageHeader.tsx`: Header component with navigation and action buttons for user pages
- `UserTable.tsx`: Component to display all users in a table format
- `UserDetail.tsx`: Page showing detailed user information
- `UserEdit.tsx`: Page for editing user details
- `UserProfileCard.tsx`: Card component displaying user profile information
- `UserAssignmentCard.tsx`: Card showing user assignments to games and sessions
- `UserCommentsCard.tsx`: Card showing and allowing editing of user comments

## Service Architecture

### Admin Management Services

- `adminService.ts`: Entry point for admin-related services
- `logService.ts`: Handles creation of admin action logs
- `notificationHelpers.ts`: Service for sending notifications about admin changes
- `regularAdminService.ts`: Service for managing regular admin privileges
- `superAdminService.ts`: Service for managing Super Admin privileges

### Context Architecture

- `UserContext.tsx`: Provides user state and methods throughout the application
- `PermissionContext.tsx`: Handles permission checks based on user roles
- `PermissionGate.tsx`: Component to conditionally render UI based on user permissions

## Permissions Structure

### Permission Types

The system implements fine-grained permissions using the following structure:

- `user.*`: User management permissions (view, create, edit, delete)
- `location.*`: Location management permissions
- `game.*`: Game management permissions
- `session.*`: Classroom session management permissions
- `notification.*`: Notification permissions
- `invitation.*`: Invitation permissions
- `admin.*`: Admin-specific permissions

### Role-Based Access Control

The system assigns permissions based on user roles:

- **Super Admin**: Has all permissions, including managing other admins
- **Regular Admin**: Has all permissions except managing other admins
- **Presenter**: Limited permissions for viewing resources
- **Observer**: Minimal permissions for viewing games and sessions
- **Camper**: Minimal permissions for viewing games and sessions

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

## Notification System

The notification system keeps users informed about changes to their admin status:

- **Email Notifications**: Sent to users when their admin status changes
- **SMS Notifications**: Optional notifications for users who prefer text messages
- **In-App Toasts**: Immediate feedback about administrative actions

## Logging System

All admin privilege changes are logged with the following information:
- From user (who made the change)
- To user (who was affected)
- Action type (grant, revoke, transfer)
- Timestamp
- Status (completed)

## Development Guidelines

1. **Component Creation**
   - Create small, focused components (50 lines or less when possible)
   - Each component should have a single responsibility

2. **Service Organization**
   - Use service modules to encapsulate related functionality
   - Separate concerns between different service types

3. **Permission Handling**
   - Always use the PermissionGate component for conditional rendering
   - Check permissions in service functions before performing actions

4. **State Management**
   - Use context providers for application-wide state
   - Use local state for component-specific concerns

## Component Relationships Diagram

```
ManageAdmins
├── AdminPageHeader
├── SuperAdminInfoCard
├── AdminList
│   ├── AdminTableRow
│   │   ├── UserAvatar
│   │   ├── StatusBadge
│   │   └── AdminActions
│   │       ├── SuperAdminGrantDialog
│   │       ├── SuperAdminRevokeDialog
│   │       ├── SuperAdminTransferDialog
│   │       └── AdminRemoveDialog
└── AdminLogs

UserManagement
├── UserPageHeader
└── UserTable
```

## Service Relationships Diagram

```
adminService (entry point)
├── logService
├── notificationHelpers
├── regularAdminService
└── superAdminService
```

## Context Usage Diagram

```
App
├── UserProvider
│   └── (provides user state and methods)
└── PermissionProvider
    └── (provides permission checks)
        └── PermissionGate
            └── (conditionally renders UI based on permissions)
```
