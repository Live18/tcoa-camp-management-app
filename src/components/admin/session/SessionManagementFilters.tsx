
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

interface SessionManagementFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  showPastSessions: boolean;
  setShowPastSessions: (value: boolean) => void;
  locations: Location[];
}

const SessionManagementFilters: React.FC<SessionManagementFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  locationFilter,
  setLocationFilter,
  showPastSessions,
  setShowPastSessions,
  locations,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
      <div className="flex items-center space-x-4 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
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
          id="showPastSessions"
          checked={showPastSessions}
          onChange={() => setShowPastSessions(!showPastSessions)}
          className="mr-2"
        />
        <label htmlFor="showPastSessions">Show Past Sessions</label>
      </div>
    </div>
  );
};

export default SessionManagementFilters;
