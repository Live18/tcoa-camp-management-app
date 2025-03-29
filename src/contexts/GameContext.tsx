
import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserRole } from "./UserContext";

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

  const publishAttendees = (gameId: string, attendeeIds: string[]) => {
    setGames((prev) =>
      prev.map((game) => {
        if (game.id === gameId) {
          return {
            ...game,
            attendees: game.attendees.map((attendee) => {
              if (attendeeIds.includes(attendee.userId)) {
                return { ...attendee, published: true };
              }
              return attendee;
            }),
          };
        }
        return game;
      })
    );
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
