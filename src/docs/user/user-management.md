
# User Management

## Overview

The user management system provides tools for managing all types of users within the Basketball Camp platform, including campers, observers, presenters, and admins.

## User Roles

- **Camper**: Regular camp participant
- **Observer**: User who can view games and sessions but not participate
- **Presenter**: User who can present at sessions and games
- **Admin**: User with administrative privileges
- **Super Admin**: Admin with highest level of privileges

## Component Structure

### Page Components
- `UserManagement.tsx`: Main page for user management
- `UserPageHeader.tsx`: Header component with navigation and action buttons for user pages
- `UserTable.tsx`: Component to display all users in a table format
- `UserDetail.tsx`: Page showing detailed user information
- `UserEdit.tsx`: Page for editing user details

### UI Components
- `UserProfileCard.tsx`: Card component displaying user profile information
- `UserAssignmentCard.tsx`: Card showing user assignments to games and sessions
- `UserCommentsCard.tsx`: Card showing and allowing editing of user comments
- `UserSwitcher.tsx`: Component for switching between different user views

## Management Workflows

### Creating a User

1. Navigate to User Management
2. Click "Add User" button
3. Fill in user details (name, email, role, etc.)
4. Optionally set notification preferences
5. Save the user

### Editing a User

1. Navigate to User Management
2. Find the user in the list
3. Click "Edit" button
4. Update user details
5. Save changes

### Changing User Role

1. Navigate to User Details
2. Click "Edit" button
3. Update the user's role in the dropdown
4. Save changes

### Managing User Notification Preferences

1. Navigate to User Details
2. Click "Edit" button
3. Update notification preferences (email, SMS, or none)
4. Save changes

## User Assignment

Users can be assigned to:
- Games (as campers, observers, or presenters)
- Classroom sessions (as attendees, observers, or presenters)

See the [User Assignment Process](../system/user-assignment.md) for more details on how assignments work.

## User Context

The `UserContext` provides access to user data and methods throughout the application. Components can consume this context to access:

- List of all users
- Current user information
- Methods for creating, updating, and deleting users
- Methods for managing admin privileges

## Best Practices

1. **Role-Based Access Control**
   - Always use the `PermissionGate` component to restrict access based on user roles
   - Check permissions before performing sensitive operations

2. **User Data Management**
   - Keep sensitive user information secure
   - Use the user context methods for all user operations
   - Validate user input before saving

3. **Notification Management**
   - Respect user notification preferences
   - Avoid sending unnecessary notifications
   - Use the notification service for all user communications
