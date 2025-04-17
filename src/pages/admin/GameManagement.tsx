
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { useLocation } from "@/contexts/LocationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Search, Calendar, MapPin, Users, Eye, ArrowLeft } from "lucide-react";
import { PermissionGate } from "@/components/auth/PermissionGate";

const GameManagement = () => {
  const navigate = useNavigate();
  const { games } = useGame();
  const { locations } = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [showPastGames, setShowPastGames] = useState(false);

  // Filter games based on search term, location, and date
  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "all" || game.locationId === locationFilter;
    
    // Filter out past games unless showPastGames is true
    const gameDate = new Date(game.date);
    const isUpcoming = gameDate >= new Date() || showPastGames;
    
    return matchesSearch && matchesLocation && isUpcoming;
  });

  // Sort games by date
  const sortedGames = [...filteredGames].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin")}
              className="px-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Game Management</h1>
          </div>
          <PermissionGate action="game.create">
            <Button onClick={() => navigate("/admin/games/new")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Game
            </Button>
          </PermissionGate>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search games..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select
                  value={locationFilter}
                  onValueChange={setLocationFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showPastGames"
                  checked={showPastGames}
                  onChange={() => setShowPastGames(!showPastGames)}
                  className="mr-2"
                />
                <label htmlFor="showPastGames">Show Past Games</label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Game Title</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">Campers</TableHead>
                  <TableHead className="text-center">Observers</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedGames.length > 0 ? (
                  sortedGames.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell className="font-medium">{game.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {formatDate(game.date)} at {formatTime(game.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          {getLocationName(game.locationId)} - Court {game.courtNumber}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="flex items-center justify-center w-20 mx-auto">
                          <Users className="h-3 w-3 mr-1" />
                          {game.currentCampers} / {game.maxCampers}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center justify-center w-12 mx-auto">
                          <Eye className="h-3 w-3 mr-1" />
                          {countObservers(game)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <PermissionGate action="game.edit">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/games/${game.id}`)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Manage
                          </Button>
                        </PermissionGate>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No games found. {locationFilter !== "all" && "Try changing the location filter."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
};

export default GameManagement;
