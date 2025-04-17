
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
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
import { PlusCircle, Edit, Search, Calendar, MapPin, Users, Presentation } from "lucide-react";
import { PermissionGate } from "@/components/auth/PermissionGate";

const ClassroomSessionManagement = () => {
  const navigate = useNavigate();
  const { sessions } = useClassroomSession();
  const { locations } = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [showPastSessions, setShowPastSessions] = useState(false);

  // Filter sessions based on search term, location, and date
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "all" || session.locationId === locationFilter;
    
    // Filter out past sessions unless showPastSessions is true
    const sessionDate = new Date(session.date);
    const isUpcoming = sessionDate >= new Date() || showPastSessions;
    
    return matchesSearch && matchesLocation && isUpcoming;
  });

  // Sort sessions by date
  const sortedSessions = [...filteredSessions].sort((a, b) => 
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

  // Count presenters for a session
  const countPresenters = (session: any) => {
    return session.attendees.filter(att => att.role === "presenter").length;
  };

  return (
    <PermissionGate action="session.view">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Classroom Session Management</h1>
          <PermissionGate action="session.create">
            <Button onClick={() => navigate("/admin/classroom-sessions/new")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Session
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
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session Title</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">Campers</TableHead>
                  <TableHead className="text-center">Presenters</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSessions.length > 0 ? (
                  sortedSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">{session.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {formatDate(session.date)} at {formatTime(session.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          {getLocationName(session.locationId)} - Room {session.roomName}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="flex items-center justify-center w-20 mx-auto">
                          <Users className="h-3 w-3 mr-1" />
                          {session.currentCampers} / {session.maxCampers}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center justify-center w-12 mx-auto">
                          <Presentation className="h-3 w-3 mr-1" />
                          {countPresenters(session)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <PermissionGate action="session.edit">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/classroom-sessions/${session.id}`)}
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
                      No classroom sessions found. {locationFilter !== "all" && "Try changing the location filter."}
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

export default ClassroomSessionManagement;
