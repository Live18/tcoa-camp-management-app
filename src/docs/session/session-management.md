
# Classroom Session Management

## Overview

The Classroom Session Management system enables administrators to create, edit, and manage educational sessions within the basketball camp. Sessions typically take place in classroom settings and focus on theoretical aspects of basketball, strategy, or other educational content.

## Component Structure

### Page Components
- `SessionManagement.tsx`: Main page for managing all classroom sessions
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
   - Click on "Sessions" in the navigation menu
   - Click "Add Session" button

2. **Fill in Session Details**
   - Title: Name or topic of the session
   - Description: Detailed information about the session content
   - Date and Time: When the session is scheduled
   - Location: Where the session will take place
   - Room: Specific room for the session
   - Maximum Number of Attendees: Attendance limit
   - Materials: Any required materials for the session

3. **Assign Participants (Optional)**
   - Assign presenters who will lead the session
   - Assign observers who will watch the session
   - Assign campers who will attend the session

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

3. **Handling Conflicts**
   - System checks for scheduling conflicts
   - Users cannot be assigned to multiple sessions at the same time
   - Warning displayed if conflicts are detected

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
   - Avoid scheduling sessions during meal times
   - Balance classroom time with on-court activities
   - Consider the age and attention span of campers when setting session lengths

2. **Content Management**
   - Ensure session content is age-appropriate
   - Include interactive elements in longer sessions
   - Provide materials in advance to presenters

3. **Permissions**
   - Use `PermissionGate` with the appropriate session permissions:
     - `session.view`: For viewing session details
     - `session.create`: For creating new sessions
     - `session.edit`: For editing existing sessions
     - `session.delete`: For deleting sessions
     - `session.manage_attendees`: For managing session attendees
