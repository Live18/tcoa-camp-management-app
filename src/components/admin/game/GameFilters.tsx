
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Location } from "@/contexts/LocationContext";

interface GameFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  showPastGames: boolean;
  setShowPastGames: (value: boolean) => void;
  locations: Location[];
}

const GameFilters: React.FC<GameFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  locationFilter,
  setLocationFilter,
  showPastGames,
  setShowPastGames,
  locations,
}) => {
  return (
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
  );
};

export default GameFilters;
