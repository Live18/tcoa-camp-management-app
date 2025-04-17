
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Calendar, MapPin, Users, Presentation } from "lucide-react";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { ClassroomSession } from "@/contexts/ClassroomSessionContext";

interface SessionListProps {
  sessions: ClassroomSession[];
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
  getLocationName: (locationId: string) => string;
  countPresenters: (session: ClassroomSession) => number;
  locationFilter: string;
}

const SessionList: React.FC<SessionListProps> = ({
  sessions,
  formatDate,
  formatTime,
  getLocationName,
  countPresenters,
  locationFilter
}) => {
  const navigate = useNavigate();
  
  return (
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
        {sessions.length > 0 ? (
          sessions.map((session) => (
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
  );
};

export default SessionList;
