
# Session Management

## Overview

The Session Management system allows administrators to create, edit, and manage classroom sessions within the camp. Sessions have specific locations, times, and can have various types of attendees including campers, presenters, and observers.

## Component Structure

### Page Components
- `ClassroomSessionManagement.tsx`: Main page for managing all classroom sessions
- `SessionManagement.tsx`: General session management interface
- `SessionCreate.tsx`: Page for creating new sessions
- `SessionDetail.tsx`: Page showing detailed session information
- `SessionEdit.tsx`: Page for editing session details

### UI Components
- `SessionList.tsx`: Displays the list of sessions in a table format
- `SessionForm.tsx`: Form for creating and editing sessions
- `SessionCalendar.tsx`: Calendar view of scheduled sessions

## Session Management Workflow

### Creating a Session

1. **Navigate to Session Management**
   - Go to the Admin Dashboard
   - Click on "Classroom Sessions" in the navigation menu
   - Click "Create Session" button

2. **Fill in Session Details**
   - Title: Name or identifier for the session
   - Description: Details about the session's purpose or activities
   - Date and Time: When the session is scheduled
   - Location: Where the session will take place
   - Room Name/Number: Specific room for the session
   - Maximum Number of Campers: Attendance limit

3. **Assign Participants (Optional)**
   - Assign presenters who will lead the session
   - Assign observers who will watch the session
   - Assign campers who will participate in the session
   - Note: Campers cannot be assigned as presenters or observers

4. **Save the Session**
   - Click "Create Session" to save the new session
   - System will validate all required fields
   - On success, redirect to the session details page

### Editing a Session

1. **Navigate to Session Details**
   - Find the session in the Session Management list
   - Click on the session name to view details
   - Click "Edit" button

2. **Update Session Details**
   - Modify any of the session details
   - Update participant assignments if needed
   - Click "Save Changes" to update

3. **Cancel or Delete**
   - Click "Cancel" to discard changes
   - Click "Delete" to remove the session (requires confirmation)

### Managing Session Attendees

1. **Navigate to Session Details**
   - Find the session in the Session Management list
   - Click on the session name to view details
   - Click "Manage Attendees" tab

2. **Using the Attendee Manager**
   - Use `AttendeeManager` component to:
     - Add campers to the session
     - Add presenters to the session
     - Add observers to the session
     - Remove attendees from the session

3. **Role Restrictions**
   - Campers cannot be assigned as presenters or observers
   - The system enforces these role restrictions
   - Role-ineligible users are not selectable for incompatible roles

4. **Handling Conflicts**
   - System checks for scheduling conflicts
   - Users cannot be assigned to multiple sessions at the same time
   - Warning displayed if conflicts are detected

## Presenter Management

Classroom sessions can have designated presenters who lead the session:

1. **Viewing Presenter Count**
   - The Session Management list shows the number of presenters for each session
   - The Session Detail page also displays presenter count

2. **Adding Presenters**
   - Presenters can only be staff with appropriate roles (not campers)
   - Navigate to the Session Detail page
   - Use the Attendee Manager to add presenters
   - Select "Presenter" as the role when adding attendees

3. **Presenter Permissions**
   - Presenters have access to view and interact with session details
   - They can see session information and attendees
   - They cannot modify session details or attendees unless they have admin privileges

4. **Publishing Presenter Assignments**
   - Presenter assignments must be published before users can see them
   - Use the "Publish Assignments" functionality to make them visible to users

## Session Context

The `ClassroomSessionContext` provides access to session data and methods throughout the application. Components can consume this context to:

- Access list of all sessions
- Filter sessions by location, date, or other criteria
- Create, update, and delete sessions
- Manage session attendees

## Related Components

- `LocationSessions.tsx`: Shows sessions associated with a specific location
- `UserAssignmentCard.tsx`: Shows sessions a user is assigned to

## Best Practices

1. **Session Scheduling**
   - Avoid scheduling multiple sessions at the same location and time
   - Consider travel time when scheduling consecutive sessions
   - Leave buffer time between sessions for transition

2. **Attendee Management**
   - Check for scheduling conflicts before assigning attendees
   - Balance the number of campers across sessions
   - Ensure appropriate presenter-to-camper ratios
   - Never assign campers as presenters or observers

3. **Permissions**
   - Use `PermissionGate` with the appropriate session permissions:
     - `session.view`: For viewing session details
     - `session.create`: For creating new sessions
     - `session.edit`: For editing existing sessions
     - `session.delete`: For deleting sessions
     - `session.manage_attendees`: For managing session attendees
