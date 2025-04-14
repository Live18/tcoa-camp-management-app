
import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserRole } from "./UserContext";
import { useUser } from "./UserContext";
import { useLocation } from "./LocationContext";
import { sendNotification, generateGameAssignmentMessage } from "@/utils/notificationService";
import { toast } from "@/components/ui/use-toast";

export interface GameAttendee {
  userId: string;
  role: UserRole; // camper or observer
  published: boolean; // track if assignment has been published
}

export interface Game {
  id: string;
  title: string;
  description: string;
  date: string;
  locationId: string;
  courtNumber: number;
  maxCampers: number;
  currentCampers: number;
  attendees: GameAttendee[];
}

interface GameContextType {
  games: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  addGame: (game: Omit<Game, "id">) => void;
  updateGame: (id: string, gameData: Partial<Game>) => void;
  deleteGame: (id: string) => void;
  getGame: (id: string) => Game | undefined;
  getGamesByLocationId: (locationId: string) => Game[];
  getUnpublishedAttendees: () => number;
  publishAttendees: (gameId: string, attendeeIds: string[]) => void;
  resetAllGames: () => void; // Added method for end camp functionality
  isUserAvailableAt: (userId: string, date: string, durationMinutes: number) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Sample games
const sampleGames: Game[] = [
  {
    id: "1",
    title: "Basketball Fundamentals",
    description: "Learn the basic skills of basketball",
    date: "2023-07-15T10:00:00Z",
    locationId: "1",
    courtNumber: 1,
    maxCampers: 9,
    currentCampers: 3,
    attendees: [
      { userId: "1", role: "admin", published: true },
      { userId: "2", role: "observer", published: true },
      { userId: "3", role: "camper", published: true },
    ],
  },
  {
    id: "2",
    title: "Advanced Dribbling",
    description: "Master advanced dribbling techniques",
    date: "2023-07-20T14:30:00Z",
    locationId: "2",
    courtNumber: 2,
    maxCampers: 9,
    currentCampers: 2,
    attendees: [
      { userId: "1", role: "admin", published: true },
      { userId: "3", role: "camper", published: false },
    ],
  },
];

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>(sampleGames);
  const { users } = useUser();
  const { getLocation } = useLocation();

  const addGame = (game: Omit<Game, "id">) => {
    const newGame = {
      ...game,
      id: Date.now().toString(),
    };
    setGames((prev) => [...prev, newGame]);
  };

  const updateGame = (id: string, gameData: Partial<Game>) => {
    setGames((prev) =>
      prev.map((game) =>
        game.id === id ? { ...game, ...gameData } : game
      )
    );
  };

  const deleteGame = (id: string) => {
    setGames((prev) => prev.filter((game) => game.id !== id));
  };

  const getGame = (id: string) => {
    return games.find((game) => game.id === id);
  };

  const getGamesByLocationId = (locationId: string) => {
    return games.filter((game) => game.locationId === locationId);
  };

  const getUnpublishedAttendees = () => {
    return games.reduce((count, game) => {
      return count + game.attendees.filter(a => !a.published).length;
    }, 0);
  };

  // Helper function to check if a user is already scheduled at a given time
  const isUserAvailableAt = (userId: string, dateString: string, durationMinutes: number = 60) => {
    const eventTime = new Date(dateString).getTime();
    // Default game duration is 60 minutes
    const eventEndTime = eventTime + (durationMinutes * 60 * 1000);

    // Check all games where this user is an attendee
    const userGames = games.filter(game => 
      game.attendees.some(attendee => attendee.userId === userId)
    );

    // Check if any of those games overlap with the provided time
    const hasConflict = userGames.some(game => {
      const gameTime = new Date(game.date).getTime();
      const gameEndTime = gameTime + (durationMinutes * 60 * 1000);
      
      // Check for overlap
      return (
        (eventTime >= gameTime && eventTime < gameEndTime) || // Event starts during an existing game
        (eventEndTime > gameTime && eventEndTime <= gameEndTime) || // Event ends during an existing game
        (eventTime <= gameTime && eventEndTime >= gameEndTime) // Event completely encloses an existing game
      );
    });

    return !hasConflict;
  };

  const publishAttendees = (gameId: string, attendeeIds: string[]) => {
    const game = getGame(gameId);
    if (!game) return;

    const location = getLocation(game.locationId);
    const locationName = location ? location.name : "Unknown Location";
    
    setGames((prev) =>
      prev.map((game) => {
        if (game.id === gameId) {
          return {
            ...game,
            attendees: game.attendees.map((attendee) => {
              if (attendeeIds.includes(attendee.userId)) {
                // Find the user to send notification
                const user = users.find(u => u.id === attendee.userId);
                if (user) {
                  // Generate and send notification based on user preference
                  const message = generateGameAssignmentMessage(
                    game.title,
                    game.date,
                    locationName,
                    game.courtNumber,
                    attendee.role
                  );
                  
                  const notificationSent = sendNotification({
                    title: "New Game Assignment",
                    message,
                    user
                  });
                  
                  if (notificationSent) {
                    console.log(`Notification sent to ${user.name} about game assignment`);
                  }
                }
                return { ...attendee, published: true };
              }
              return attendee;
            }),
          };
        }
        return game;
      })
    );
    
    // Show a toast notification for admins
    toast({
      title: "Attendees Published",
      description: `${attendeeIds.length} attendee assignments have been published with notifications sent.`
    });
  };

  // Add a method to reset all games
  const resetAllGames = () => {
    setGames([]);
  };

  return (
    <GameContext.Provider
      value={{
        games,
        setGames,
        addGame,
        updateGame,
        deleteGame,
        getGame,
        getGamesByLocationId,
        getUnpublishedAttendees,
        publishAttendees,
        resetAllGames,
        isUserAvailableAt,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
