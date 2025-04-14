# Permission System Implementation

## Overview

The permission system enables granular access control throughout the application using a role-based access control (RBAC) model. This system determines what actions users can perform based on their assigned role.

## Core Components

- `PermissionContext.tsx`: Context provider for permission-related functionality
- `PermissionGate.tsx`: Component for conditionally rendering UI based on permissions
- `usePermission.tsx`: Hook for checking permissions in functional components

## Permission Structure

Permissions are structured as action strings in the format `resource.operation`. The main permission categories include:

### User Permissions
- `user.view`: View user details
- `user.create`: Create new users
- `user.edit`: Edit user details
- `user.delete`: Delete users

### Location Permissions
- `location.view`: View location details
- `location.create`: Create new locations
- `location.edit`: Edit location details
- `location.delete`: Delete locations

### Game Permissions
- `game.view`: View game details
- `game.create`: Create new games
- `game.edit`: Edit game details
- `game.delete`: Delete games
- `game.manage_attendees`: Manage game attendees

### Session Permissions
- `session.view`: View session details
- `session.create`: Create new sessions
- `session.edit`: Edit session details
- `session.delete`: Delete sessions
- `session.manage_attendees`: Manage session attendees

### Admin Permissions
- `admin.view`: View admin details
- `admin.manage`: Basic admin management
- `admin.manage_other_admins`: Manage other administrators

### Other Permissions
- `notification.*`: Notification permissions
- `invitation.*`: Invitation permissions

## Role-Based Access Control

The system assigns permissions based on user roles:

- **Super Admin**: Has all permissions, including managing other admins
- **Regular Admin**: Has all permissions except managing other admins
- **Presenter**: Limited permissions for viewing resources and managing assigned sessions/games
- **Observer**: Minimal permissions for viewing games and sessions
- **Camper**: Minimal permissions for viewing assigned games and sessions

## Permission Checking Functions

- `can(action)`: Checks if the current user has permission for a specific action
- `canAny(actions[])`: Checks if the current user has permission for any of the specified actions
- `canAll(actions[])`: Checks if the current user has permission for all of the specified actions

## Using Permission Gate

The `PermissionGate` component conditionally renders UI elements based on user permissions:

```tsx
<PermissionGate action="game.edit">
  <Button onClick={handleEditGame}>Edit Game</Button>
</PermissionGate>
```

For checking multiple permissions:

```tsx
<PermissionGate 
  action={["game.edit", "game.delete"]} 
  requireAll={false}
>
  <AdminActions />
</PermissionGate>
```

The component also supports fallback UI and redirects:

```tsx
<PermissionGate 
  action="admin.manage_other_admins"
  fallback={<AccessDeniedMessage />}
  redirectTo="/dashboard"
>
  <AdminControls />
</PermissionGate>
```

## Using the Permission Hook

For programmatic permission checks in component logic:

```tsx
const { can, canAll, canAny } = usePermission();

// Check a single permission
if (can("game.edit")) {
  // Allow editing
}

// Check if user has all permissions
if (canAll(["game.edit", "game.delete"])) {
  // Allow both editing and deleting
}

// Check if user has any of the permissions
if (canAny(["game.edit", "game.delete"])) {
  // Allow either editing or deleting
}
```

## Extending Permissions

To add new permissions:

1. Define the new permission in the `PermissionAction` type in `PermissionContext.tsx`:
```tsx
export type PermissionAction = 
  // ... existing permissions
  | "new_resource.view"
  | "new_resource.edit";
```

2. Add the permission to the appropriate role in the `rolePermissions` object:
```tsx
const rolePermissions: Record<UserRole, PermissionAction[]> = {
  admin: [
    // ... existing admin permissions
    "new_resource.view", "new_resource.edit"
  ],
  // ... other roles
};
```

3. Use the permission in your components with `PermissionGate` or the `usePermission` hook

## Best Practices

1. **Always Use Permission Gate**
   - Wrap all sensitive UI elements with `PermissionGate`
   - Don't rely on hiding UI elements as the only form of access control

2. **Check Permissions Programmatically**
   - Use the permission hook for conditional logic
   - Verify permissions before performing sensitive operations

3. **Keep Permissions Granular**
   - Create specific permissions for different operations
   - Avoid overly broad permissions that grant too much access

4. **Document New Permissions**
   - When adding new permissions, document their purpose and usage
   - Make sure all developers understand the permission structure
