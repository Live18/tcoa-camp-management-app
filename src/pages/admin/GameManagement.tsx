
import React, { useState, useMemo } from "react";
import { useGame } from "@/contexts/GameContext";
import { useLocation } from "@/contexts/LocationContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { formatDate, formatTime } from "@/utils/dateUtils";
import ManagementPageHeader from "@/components/admin/common/ManagementPageHeader";
import GameFilters from "@/components/admin/game/GameFilters";
import GameList from "@/components/admin/game/GameList";

const GameManagement = () => {
  const { games } = useGame();
  const { locations } = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [showPastGames, setShowPastGames] = useState(false);

  // Filter games based on search term, location, and date
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter === "all" || game.locationId === locationFilter;
      
      // Filter out past games unless showPastGames is true
      const gameDate = new Date(game.date);
      const isUpcoming = gameDate >= new Date() || showPastGames;
      
      return matchesSearch && matchesLocation && isUpcoming;
    });
  }, [games, searchTerm, locationFilter, showPastGames]);

  // Sort games by date
  const sortedGames = useMemo(() => {
    return [...filteredGames].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [filteredGames]);

  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : "Unknown Location";
  };

  // Count observers for a game
  const countObservers = (game: any) => {
    return game.attendees.filter(att => att.role === "observer").length;
  };

  return (
    <PermissionGate action="game.view">
      <div className="container mx-auto py-6">
        <ManagementPageHeader 
          title="Game Management"
          createButtonLabel="Create Game"
          createPermission="game.create"
          createPath="/admin/games/new"
        />
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <GameFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              showPastGames={showPastGames}
              setShowPastGames={setShowPastGames}
              locations={locations}
            />
          </CardHeader>
          <CardContent>
            <GameList 
              games={sortedGames}
              formatDate={formatDate}
              formatTime={formatTime}
              getLocationName={getLocationName}
              countObservers={countObservers}
            />
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
};

export default GameManagement;
