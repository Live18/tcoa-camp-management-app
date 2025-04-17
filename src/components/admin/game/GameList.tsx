
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Calendar, MapPin, Users, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { Game } from "@/contexts/GameContext";

interface GameListProps {
  games: Game[];
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
  getLocationName: (locationId: string) => string;
  countObservers: (game: Game) => number;
}

const GameList: React.FC<GameListProps> = ({
  games,
  formatDate,
  formatTime,
  getLocationName,
  countObservers,
}) => {
  const navigate = useNavigate();
  
  return (
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
        {games.length > 0 ? (
          games.map((game) => (
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
              No games found. {games.length === 0 && "Try changing the location filter."}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default GameList;
