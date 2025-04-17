
# Game Management

## Overview

The Game Management system allows administrators to create, edit, and manage basketball games within the camp. Games have specific locations, times, and can have various types of attendees including campers, presenters, and observers.

## Component Structure

### Page Components
- `GameManagement.tsx`: Main page for managing all games
- `GameCreate.tsx`: Page for creating new games
- `GameDetail.tsx`: Page showing detailed game information
- `GameEdit.tsx`: Page for editing game details

### UI Components
- `GameList.tsx`: Displays the list of games in a table format
- `GameForm.tsx`: Form for creating and editing games
- `GameCalendar.tsx`: Calendar view of scheduled games

## Game Management Workflow

### Creating a Game

1. **Navigate to Game Management**
   - Go to the Admin Dashboard
   - Click on "Games" in the navigation menu
   - Click "Add Game" button

2. **Fill in Game Details**
   - Title: Name or identifier for the game
   - Description: Details about the game's purpose or activities
   - Date and Time: When the game is scheduled
   - Location: Where the game will take place
   - Court Number: Specific court for the game
   - Maximum Number of Campers: Attendance limit

3. **Assign Participants (Optional)**
   - Assign observers who will watch the game
   - Assign campers who will participate in the game
   - Note: Campers cannot be assigned as observers

4. **Save the Game**
   - Click "Create Game" to save the new game
   - System will validate all required fields
   - On success, redirect to the game details page

### Editing a Game

1. **Navigate to Game Details**
   - Find the game in the Game Management list
   - Click on the game name to view details
   - Click "Edit" button

2. **Update Game Details**
   - Modify any of the game details
   - Update participant assignments if needed
   - Click "Save Changes" to update

3. **Cancel or Delete**
   - Click "Cancel" to discard changes
   - Click "Delete" to remove the game (requires confirmation)

### Managing Game Attendees

1. **Navigate to Game Details**
   - Find the game in the Game Management list
   - Click on the game name to view details
   - Click "Manage Attendees" tab

2. **Using the Attendee Manager**
   - Use `AttendeeManager` component to:
     - Add campers to the game
     - Add observers to the game
     - Remove attendees from the game

3. **Role Restrictions**
   - Campers cannot be assigned as observers
   - The system enforces these role restrictions
   - Role-ineligible users are not selectable for incompatible roles

4. **Handling Conflicts**
   - System checks for scheduling conflicts
   - Users cannot be assigned to multiple games at the same time
   - Warning displayed if conflicts are detected

## Observer Management

Games can have designated observers who watch but do not participate in the game:

1. **Viewing Observer Count**
   - The Game Management list shows the number of observers for each game
   - The Game Detail page also displays observer count

2. **Adding Observers**
   - Observers can only be staff with appropriate roles (not campers)
   - Navigate to the Game Detail page
   - Use the Attendee Manager to add observers
   - Select "Observer" as the role when adding attendees

3. **Observer Permissions**
   - Observers have view-only access to game details
   - They can see game information and attendees
   - They cannot modify game details or attendees

4. **Publishing Observer Assignments**
   - Observer assignments must be published before users can see them
   - Use the "Publish Assignments" functionality to make them visible to users

## Game Context

The `GameContext` provides access to game data and methods throughout the application. Components can consume this context to:

- Access list of all games
- Filter games by location, date, or other criteria
- Create, update, and delete games
- Manage game attendees

## Related Components

- `LocationGames.tsx`: Shows games associated with a specific location
- `UserAssignmentCard.tsx`: Shows games a user is assigned to

## Best Practices

1. **Game Scheduling**
   - Avoid scheduling multiple games at the same location and time
   - Consider travel time when scheduling consecutive games
   - Leave buffer time between games for transition

2. **Attendee Management**
   - Check for scheduling conflicts before assigning attendees
   - Balance the number of campers across games
   - Ensure appropriate observer-to-camper ratios
   - Never assign campers as observers

3. **Permissions**
   - Use `PermissionGate` with the appropriate game permissions:
     - `game.view`: For viewing game details
     - `game.create`: For creating new games
     - `game.edit`: For editing existing games
     - `game.delete`: For deleting games
     - `game.manage_attendees`: For managing game attendees
