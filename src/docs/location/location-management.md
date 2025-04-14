
# Location Management

## Overview

The Location Management system allows administrators to manage the physical facilities where basketball camp activities take place. Locations can host both games and classroom sessions, with specific details like courts, rooms, and capacity.

## Component Structure

### Page Components
- `LocationManagement.tsx`: Main page for managing all locations
- `LocationCreate.tsx`: Page for creating new locations
- `LocationDetails.tsx`: Page showing detailed location information
- `LocationEdit.tsx`: Page for editing location details
- `LocationGames.tsx`: Page showing games at a specific location
- `LocationSessions.tsx`: Page showing sessions at a specific location

### UI Components
- `LocationForm.tsx`: Form for creating and editing locations
- `LocationList.tsx`: Displays the list of locations in a table format
- `LocationPageHeader.tsx`: Header component for location pages
- `LocationCard.tsx`: Card displaying location information

## Key Components

- `LocationContext.tsx`: Context provider for location-related state and operations
- `LocationManagement.tsx`: Main page for managing locations
- `LocationDetails.tsx`: Page displaying detailed information about a location
- `LocationForm.tsx`: Reusable form for creating and editing locations
- `LocationGames.tsx`: Component showing games associated with a location
- `LocationSessions.tsx`: Component showing sessions associated with a location

## Location Management Workflow

### Creating a Location

1. **Navigate to Location Management**
   - Go to the Admin Dashboard
   - Click on "Locations" in the navigation menu
   - Click "Add Location" button

2. **Fill in Location Details**
   - Name: Identifier for the location
   - Address: Street address
   - City: City name
   - State: State or province
   - Zip: Postal code
   - Coordinates: GPS coordinates (optional)
   - Description: Additional details about the location
   - Facilities: Available facilities at the location
   - Courts: Number of basketball courts
   - Rooms: Number of classroom spaces

3. **Save the Location**
   - Click "Create Location" to save the new location
   - System will validate all required fields
   - On success, redirect to the location details page

### Editing a Location

1. **Navigate to Location Details**
   - Find the location in the Location Management list
   - Click on the location name to view details
   - Click "Edit" button

2. **Update Location Details**
   - Modify any of the location details
   - Click "Save Changes" to update

3. **Cancel or Delete**
   - Click "Cancel" to discard changes
   - Click "Delete" to remove the location (requires confirmation)

### Managing Location Resources

1. **Navigate to Location Details**
   - Find the location in the Location Management list
   - Click on the location name to view details

2. **Managing Games at the Location**
   - Click on the "Games" tab
   - View all games scheduled at this location
   - Click "Add Game" to create a new game at this location
   - Click on a game to view or edit its details

3. **Managing Sessions at the Location**
   - Click on the "Sessions" tab
   - View all sessions scheduled at this location
   - Click "Add Session" to create a new session at this location
   - Click on a session to view or edit its details

### Deleting a Location

1. **Navigate to Location Details**
   - Find the location in the Location Management list
   - Click on the location name to view details
   - Click "Delete" button

2. **Confirmation Process**
   - System checks for associated games and sessions
   - If none exist, confirm deletion
   - If resources exist, choose to delete them or cancel the operation

## Location Context

The `LocationContext` provides access to location data and methods throughout the application. Components can consume this context to:

- Access list of all locations
- Filter locations by various criteria
- Create, update, and delete locations
- Access games and sessions associated with locations

## Best Practices

1. **Location Setup**
   - Include detailed information about facilities
   - Add notes about parking, accessibility, or special considerations
   - Upload photos of the location if possible

2. **Resource Management**
   - Consider location capacity when scheduling games and sessions
   - Avoid scheduling conflicts for specific rooms or courts
   - Balance activities across available locations

3. **Permissions**
   - Use `PermissionGate` with the appropriate location permissions:
     - `location.view`: For viewing location details
     - `location.create`: For creating new locations
     - `location.edit`: For editing existing locations
     - `location.delete`: For deleting locations
