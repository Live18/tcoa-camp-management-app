
# User Assignment Process

## Overview

The user assignment system allows administrators to assign users to games and sessions. This process ensures proper tracking of attendance and enables users to see their scheduled activities.

## Key Components

- `AttendeeManager.tsx`: Main component for managing attendee assignments
- `AttendeeList.tsx`: Displays current attendees for a game or session
- `AttendeeSelector.tsx`: Interface for selecting users to assign
- `AttendeeAvailabilityUtils.tsx`: Utilities for checking user availability

## Assignment Workflow

### Viewing Current Assignments

1. Navigate to Game/Session Details
2. View the list of current attendees by role:
   - Campers: Regular participants
   - Presenters: Staff leading the activity
   - Observers: Staff watching but not leading

### Adding Assignments

1. **Access Management Interface**
   - Navigate to Game/Session Details
   - Click "Manage Attendees" button

2. **Select Attendee Type**
   - Choose the role for the new attendee:
     - Camper
     - Presenter
     - Observer

3. **Select Users**
   - View list of eligible users
   - Users are filtered by:
     - Appropriate role for the assignment
     - Availability during the scheduled time
   - Select one or more users to assign

4. **Confirm Assignment**
   - Click "Assign" button
   - System checks for scheduling conflicts
   - If no conflicts, users are assigned
   - If conflicts exist, warnings are displayed

5. **Notification**
   - Assigned users receive notifications based on their preferences
   - System displays success message

### Removing Assignments

1. **Access Management Interface**
   - Navigate to Game/Session Details
   - Click "Manage Attendees" button

2. **Select Assigned Users**
   - View list of current attendees
   - Select one or more users to remove

3. **Confirm Removal**
   - Click "Remove" button
   - Confirm removal in dialog

4. **Notification**
   - Removed users receive notifications based on their preferences
   - System displays success message

## Handling Conflicts

The system includes conflict detection to prevent double-booking users:

1. **Schedule Conflict Detection**
   - When assigning a user, the system checks their existing assignments
   - Conflicts are detected when:
     - The user is already assigned to another game/session at the same time
     - The time ranges overlap with another assignment

2. **Conflict Resolution**
   - Warning displayed to administrator
   - Options presented:
     - Cancel the new assignment
     - Continue and create a conflict (not recommended)
     - Remove conflicting assignment and create new one

## Assignment Data Structure

Assignments are stored in the respective contexts:

### Game Context

The `GameContext` stores game attendees with the following structure:
```typescript
interface GameAttendees {
  campers: string[]; // User IDs
  presenters: string[];
  observers: string[];
}
```

### Session Context

The `ClassroomSessionContext` stores session attendees with the following structure:
```typescript
interface SessionAttendees {
  attendees: string[]; // User IDs
  presenters: string[];
  observers: string[];
}
```

## Attendee Manager Implementation

The `AttendeeManager` component handles the UI and logic for managing assignments:

```tsx
<AttendeeManager
  type="game" // or "session"
  itemId={gameId} // or sessionId
  date={gameDate}
  startTime={startTime}
  endTime={endTime}
  currentAttendees={currentAttendees}
  onAttendeeChange={handleAttendeeChange}
/>
```

The component uses the following sub-components:
- `AttendeeList`: Displays current attendees with remove functionality
- `AttendeeSelector`: Interface for finding and adding new attendees

## Best Practices

1. **Balance Assignments**
   - Distribute campers evenly across groups
   - Ensure appropriate ratios of presenters to campers
   - Avoid overloading any single presenter

2. **Consider User Experience**
   - Allow adequate transition time between assignments
   - Group similar activities for efficiency
   - Consider user preferences when possible

3. **Regular Auditing**
   - Periodically review assignments for conflicts
   - Check for under or over-assigned users
   - Ensure all required roles are filled for each activity
