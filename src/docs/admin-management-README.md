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

## Game & Session Management Workflows

### Game Management Workflow

1. **Creating a Game**
   - Navigate to Game Management or a specific location's games page
   - Click "Add Game" button
   - Fill in game details (title, description, date, time, court number, max campers)
   - Assign presenters/observers (optional)
   - Save the game

2. **Editing a Game**
   - Navigate to Game Management or a specific location's games page
   - Find the game in the list
   - Click "Edit" button
   - Update game details
   - Save changes

3. **Managing Game Attendees**
   - Navigate to Game Details
   - Click "Manage Attendees" tab
   - Use AttendeeManager component to add/remove campers, presenters, and observers
   - Save changes

4. **Deleting a Game**
   - Navigate to Game Details
   - Click "Delete" button
   - Confirm deletion

### Classroom Session Management Workflow

1. **Creating a Session**
   - Navigate to Session Management or a specific location's sessions page
   - Click "Add Session" button
   - Fill in session details (title, description, date, time, room, max attendees)
   - Assign presenters/observers (optional)
   - Save the session

2. **Editing a Session**
   - Navigate to Session Management or a specific location's sessions page
   - Find the session in the list
   - Click "Edit" button
   - Update session details
   - Save changes

3. **Managing Session Attendees**
   - Navigate to Session Details
   - Click "Manage Attendees" tab
   - Use AttendeeManager component to add/remove campers, presenters, and observers
   - Save changes

4. **Deleting a Session**
   - Navigate to Session Details
   - Click "Delete" button
   - Confirm deletion

## Location Management System

### Key Components

- `LocationContext.tsx`: Context provider for location-related state and operations
- `LocationManagement.tsx`: Main page for managing locations
- `LocationDetails.tsx`: Page displaying detailed information about a location
- `LocationForm.tsx`: Reusable form for creating and editing locations
- `LocationGames.tsx`: Component showing games associated with a location
- `LocationSessions.tsx`: Component showing sessions associated with a location

### Location Management Workflow

1. **Creating a Location**
   - Navigate to Location Management
   - Click "Add Location" button
   - Fill in location details (name, address, city, state, zip, coordinates, notes)
   - Save the location

2. **Editing a Location**
   - Navigate to Location Management
   - Find the location in the list
   - Click "Edit" button
   - Update location details
   - Save changes

3. **Managing Location Resources**
   - Navigate to Location Details
   - View tabs for Games and Sessions at this location
   - Add, edit, or delete resources associated with the location

4. **Deleting a Location**
   - Navigate to Location Details
   - Click "Delete" button
   - System checks for associated games and sessions
   - If none exist, confirm deletion
   - If resources exist, choose to delete them or cancel the operation

## Notification System Architecture

The notification system is designed to keep users informed about relevant events across the platform.

### Components and Services

- `notificationService.ts`: Primary service handling notification delivery
- `emailService.ts`: Service for sending email notifications
- `Toaster.tsx`: Component for displaying in-app toast notifications

### Notification Types and Channels

- **Admin Status Changes**: Notifications when admin privileges are granted, revoked, or transferred
- **Game Assignments**: Notifications when users are assigned to games
- **Session Assignments**: Notifications when users are assigned to classroom sessions
- **System Announcements**: General announcements from administrators

### Notification Channels

- **Email**: Sent via `sendGmailEmail` function in `emailService.ts`
- **SMS**: Sent via `sendSmsNotification` function in `notificationService.ts`
- **In-App Toasts**: Displayed using the toast component from `@/components/ui/use-toast`

### Notification Preferences

Users can set their notification preferences in their profile:
- **Email**: Notifications sent to the user's email address
- **SMS**: Notifications sent to the user's phone number
- **None**: No notifications sent

### Implementation Details

- `sendNotification` function checks user preferences and sends notifications accordingly
- Message templates for different notification types (admin changes, assignments)
- Logging of notification delivery status for troubleshooting

## Permission System Implementation

The permission system enables granular access control throughout the application.

### Core Components

- `PermissionContext.tsx`: Context provider for permission-related functionality
- `PermissionGate.tsx`: Component for conditionally rendering UI based on permissions
- `usePermission.tsx`: Hook for checking permissions in functional components

### Permission Structure

Permissions are structured as action strings in the format `resource.operation`:
- `user.view`, `user.create`, `user.edit`, `user.delete`
- `location.view`, `location.create`, `location.edit`, `location.delete`
- `game.view`, `game.create`, `game.edit`, `game.delete`, `game.manage_attendees`
- `session.view`, `session.create`, `session.edit`, `session.delete`, `session.manage_attendees`

### Permission Checking Functions

- `can(action)`: Checks if the current user has permission for a specific action
- `canAny(actions[])`: Checks if the current user has permission for any of the specified actions
- `canAll(actions[])`: Checks if the current user has permission for all of the specified actions

### Extending Permissions

To add new permissions:
1. Define the new permission in the `PermissionAction` type in `PermissionContext.tsx`
2. Add the permission to the appropriate role in the `rolePermissions` object
3. Use the permission in your components with `PermissionGate` or the `usePermission` hook

### Example: Adding a New Permission
```typescript
// 1. Update PermissionAction type in PermissionContext.tsx
export type PermissionAction = 
  // ... existing permissions
  | "new_resource.view"
  | "new_resource.edit";

// 2. Add to rolePermissions
const rolePermissions: Record<UserRole, PermissionAction[]> = {
  admin: [
    // ... existing admin permissions
    "new_resource.view", "new_resource.edit"
  ],
  // ... other roles
};

// 3. Use in components
<PermissionGate action="new_resource.view">
  <NewResourceViewComponent />
</PermissionGate>
```

## User Assignment Process

The user assignment system allows administrators to assign users to games and sessions.

### Key Components

- `AttendeeManager.tsx`: Main component for managing attendee assignments
- `AttendeeList.tsx`: Displays current attendees for a game or session
- `AttendeeSelector.tsx`: Interface for selecting users to assign
- `AttendeeAvailabilityUtils.tsx`: Utilities for checking user availability

### Assignment Workflow

1. **Viewing Current Assignments**
   - Navigate to Game/Session Details
   - View the list of current attendees by role (campers, presenters, observers)

2. **Adding Assignments**
   - Click "Manage Attendees" button
   - Select user role (camper, presenter, observer)
   - Select users from the list (filtered by availability and role)
   - Click "Assign" button
   - System checks for scheduling conflicts
   - System updates assignments and sends notifications

3. **Removing Assignments**
   - Select assigned users from the attendee list
   - Click "Remove" button
   - Confirm removal
   - System updates assignments and sends notifications

### Handling Conflicts

- The system checks for scheduling conflicts when assigning users
- Users cannot be assigned to multiple games or sessions at the same time
- Users receive notifications when they are assigned to or removed from games/sessions

### Assignment Data Structure

Assignments are stored in the respective contexts:
- `GameContext.tsx`: Manages game attendee assignments
- `ClassroomSessionContext.tsx`: Manages session attendee assignments

## Data Flow & State Management

The application uses React Context API for state management across different parts of the application.

### Core Context Providers

- `UserContext.tsx`: Manages user authentication, profile data, and admin operations
- `PermissionContext.tsx`: Manages permission checking based on user roles
- `LocationContext.tsx`: Manages location data and operations
- `GameContext.tsx`: Manages game data, operations, and attendees
- `ClassroomSessionContext.tsx`: Manages session data, operations, and attendees

### Data Flow Architecture

1. **Authentication Flow**
   - User logs in through `Login.tsx`
   - `UserContext` updates with current user information
   - `PermissionContext` determines available permissions
   - Route guards in `AuthGuard.tsx` control access to protected routes

2. **CRUD Operations Flow**
   - Context providers expose methods for creating, reading, updating, and deleting resources
   - Components call these methods to modify application state
   - Context providers update their state and notify subscribers
   - UI components re-render with updated data

3. **Cross-Context Communication**
   - Some operations require coordination between multiple contexts
   - For example, assigning users to games requires both `UserContext` and `GameContext`
   - Service functions coordinate these operations to maintain data consistency

### State Management Best Practices

1. **Use Context Selectively**
   - Only put shared state in contexts
   - Use local component state for UI-specific state
   - Create focused contexts for specific domains

2. **Optimize Re-renders**
   - Split contexts into smaller pieces to reduce unnecessary re-renders
   - Use memoization (useCallback, useMemo) for expensive computations
   - Use context selectors to extract only needed data

3. **Handling Side Effects**
   - Use service functions to coordinate complex operations
   - Keep side effects (API calls, notifications) in service layers
   - Use useEffect for synchronization with external systems

## UI Component Guidelines

The application uses Shadcn/UI components and Tailwind CSS for styling. These guidelines ensure consistency across the UI.

### Component Architecture

1. **Page Components**
   - Top-level components rendered by routes
   - Should be relatively thin, delegating to other components
   - Example: `ManageAdmins.tsx`, `UserManagement.tsx`

2. **Feature Components**
   - Components that implement specific features
   - Can be reused across different pages
   - Example: `AdminList.tsx`, `UserTable.tsx`

3. **UI Components**
   - Low-level, reusable components for UI elements
   - Should be highly reusable and customizable
   - Example: Shadcn components like `Button`, `Card`, `Dialog`

### Creating Custom Components

1. **Component Structure**
   - Follow a consistent file structure
   - Export components as named exports
   - Keep components small and focused (< 50 lines when possible)

2. **Props Interface**
   - Define TypeScript interfaces for component props
   - Document props with JSDoc comments
   - Use reasonable defaults for optional props

3. **Styling Guidelines**
   - Use Tailwind classes for styling
   - Follow mobile-first responsive design principles
   - Use CSS variables for theme customization

### Component Examples

**Good Component Structure:**
```tsx
import React from "react";
import { Card } from "@/components/ui/card";

interface InfoCardProps {
  /** Title displayed at the top of the card */
  title: string;
  /** Main content of the card */
  content: string;
  /** Optional action button label */
  actionLabel?: string;
  /** Optional action handler */
  onAction?: () => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  content,
  actionLabel,
  onAction
}) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mt-2">{content}</p>
      {actionLabel && onAction && (
        <button
          className="mt-4 text-sm text-primary"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </Card>
  );
};
```

## Error Handling Strategy

The application implements a consistent error handling strategy to ensure reliability and provide clear feedback to users.

### Error Handling Principles

1. **Graceful Degradation**
   - Components should handle errors gracefully
   - Provide fallback UI when components encounter errors
   - Prevent cascading failures by containing errors

2. **User Feedback**
   - Provide meaningful error messages to users
   - Use toast notifications for transient errors
   - Use inline error messages for form validation errors

3. **Error Recovery**
   - Where possible, provide retry mechanisms
   - Preserve user input when errors occur
   - Guide users on how to resolve errors

### Implementation Strategies

1. **Service Layer Error Handling**
   - Services catch and transform technical errors into user-friendly messages
   - Services return standardized error objects
   - Example pattern:
```typescript
try {
  // Operation that might fail
} catch (error) {
  console.error("Operation failed:", error);
  toast({
    title: "Error",
    description: "Failed to complete operation. Please try again.",
    variant: "destructive",
  });
  return { success: false, error: "Operation failed" };
}
```

2. **Component Error Handling**
   - Use error boundaries to catch rendering errors
   - Handle async errors with try/catch in event handlers
   - Use error states to display appropriate UI

3. **Form Validation Errors**
   - Use Zod for schema validation
   - Display validation errors inline next to form fields
   - Prevent form submission until validation passes

### Error Boundary Implementation

```tsx
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Component error:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <Card>
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              An error occurred while displaying this content.
            </p>
            <Button onClick={() => this.setState({ hasError: false, error: null })}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

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
