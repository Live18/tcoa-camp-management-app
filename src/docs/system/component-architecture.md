
# Component Architecture and State Management

## Overview

This document outlines the application's component architecture and state management approach, focusing on how data flows through the application and how components communicate with each other.

## Component Architecture

The application uses a component-based architecture with several levels of components:

### 1. Page Components
- Top-level components rendered by routes
- Should be relatively thin, delegating to other components
- Examples: `ManageAdmins.tsx`, `UserManagement.tsx`, `GameDetails.tsx`

### 2. Feature Components
- Components that implement specific features
- Can be reused across different pages
- Examples: `AdminList.tsx`, `UserTable.tsx`, `GameForm.tsx`

### 3. UI Components
- Low-level, reusable components for UI elements
- Should be highly reusable and customizable
- Examples: Shadcn components like `Button`, `Card`, `Dialog`

## State Management

The application uses React Context API for state management across different parts of the application.

### Core Context Providers

- `UserContext.tsx`: Manages user authentication, profile data, and admin operations
- `PermissionContext.tsx`: Manages permission checking based on user roles
- `LocationContext.tsx`: Manages location data and operations
- `GameContext.tsx`: Manages game data, operations, and attendees
- `ClassroomSessionContext.tsx`: Manages session data, operations, and attendees

### Provider Composition

The context providers are composed in a hierarchical structure:

```tsx
<UserProvider>
  <PermissionProvider>
    <LocationProvider>
      <GameProvider>
        <ClassroomSessionProvider>
          <App />
        </ClassroomSessionProvider>
      </GameProvider>
    </LocationProvider>
  </PermissionProvider>
</UserProvider>
```

## Data Flow Architecture

### 1. Authentication Flow

- User logs in through `Login.tsx`
- `UserContext` updates with current user information
- `PermissionContext` determines available permissions
- Route guards in `AuthGuard.tsx` control access to protected routes

### 2. CRUD Operations Flow

- Context providers expose methods for creating, reading, updating, and deleting resources
- Components call these methods to modify application state
- Context providers update their state and notify subscribers
- UI components re-render with updated data

### 3. Cross-Context Communication

- Some operations require coordination between multiple contexts
- For example, assigning users to games requires both `UserContext` and `GameContext`
- Service functions coordinate these operations to maintain data consistency

## Using Hooks for State Access

The application provides custom hooks to access context state:

```tsx
// Example component using multiple contexts
const GameAssignmentPage = () => {
  const { users } = useUser();
  const { game, updateGameAttendees } = useGame();
  const { can } = usePermission();
  
  // Component logic using context data
};
```

## State Management Best Practices

### 1. Use Context Selectively

- Only put shared state in contexts
- Use local component state for UI-specific state
- Create focused contexts for specific domains

### 2. Optimize Re-renders

- Split contexts into smaller pieces to reduce unnecessary re-renders
- Use memoization (useCallback, useMemo) for expensive computations
- Use context selectors to extract only needed data

### 3. Handling Side Effects

- Use service functions to coordinate complex operations
- Keep side effects (API calls, notifications) in service layers
- Use useEffect for synchronization with external systems

## Component Communication Patterns

### 1. Parent-Child Communication

- Pass props down from parent to child
- Pass callback functions up from child to parent

### 2. Context-Based Communication

- Use contexts for sharing state between unrelated components
- Access context values through custom hooks

### 3. Service-Based Communication

- Use service functions to coordinate actions between components
- Services can update multiple contexts as needed

## Creating Custom Components

### Component Structure

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

### Best Practices for Custom Components

1. **Props Interface**
   - Define TypeScript interfaces for component props
   - Document props with JSDoc comments
   - Use reasonable defaults for optional props

2. **Component Size**
   - Keep components small and focused (< 50 lines when possible)
   - Extract complex logic into custom hooks
   - Split large components into smaller sub-components

3. **Component Reusability**
   - Design components to be reusable across the application
   - Avoid hard-coding values that should be configurable
   - Use composition pattern with children props when appropriate
