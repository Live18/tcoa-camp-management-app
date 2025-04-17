
import React from "react";
import { ClassroomSession } from "@/types/sessionTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users } from "lucide-react";

interface SessionDetailsCardProps {
  session: ClassroomSession;
  location: any;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
}

const SessionDetailsCard: React.FC<SessionDetailsCardProps> = ({
  session,
  location,
  formatDate,
  formatTime,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{session.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>{session.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {formatDate(session.date)} at {formatTime(session.date)}
                </span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {location ? `${location.name} - ${session.roomName}` : session.roomName}
                </span>
              </div>
              
              {location && (
                <div className="pl-6 text-sm text-muted-foreground">
                  {location.address}, {location.city}, {location.state} {location.zipCode}
                </div>
              )}
              
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  <Badge variant="outline">{session.currentCampers} / {session.maxCampers}</Badge> campers
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionDetailsCard;
