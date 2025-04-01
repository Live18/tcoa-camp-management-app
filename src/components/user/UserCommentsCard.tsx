
import React from "react";
import { useGame, Game } from "@/contexts/GameContext";
import { useClassroomSession, ClassroomSession } from "@/contexts/ClassroomSessionContext";
import { useUser } from "@/contexts/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, BookOpen, Gamepad } from "lucide-react";

interface UserComment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  source: "game" | "session";
  sourceId: string;
  sourceName: string;
  userRole: string;
}

interface UserCommentsCardProps {
  userId: string;
}

export const UserCommentsCard: React.FC<UserCommentsCardProps> = ({ userId }) => {
  const { users } = useUser();
  const { games } = useGame();
  const { sessions } = useClassroomSession();
  const user = users.find(u => u.id === userId);

  // For the purpose of the demo, we'll generate some sample comments
  // In a real application, these would come from the database
  const generateSampleComments = (): UserComment[] => {
    const comments: UserComment[] = [];
    
    // Add some game comments
    games.forEach(game => {
      if (game.attendees.some(att => att.userId === userId)) {
        const userRole = game.attendees.find(att => att.userId === userId)?.role || "";
        comments.push({
          id: `game-${game.id}-1`,
          userId,
          content: `I really enjoyed this game and learned a lot about ${game.title}`,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          source: "game",
          sourceId: game.id,
          sourceName: game.title,
          userRole
        });
      }
    });
    
    // Add some session comments
    sessions.forEach(session => {
      if (session.attendees.some(att => att.userId === userId)) {
        const userRole = session.attendees.find(att => att.userId === userId)?.role || "";
        comments.push({
          id: `session-${session.id}-1`,
          userId,
          content: `The classroom session on ${session.title} was very informative`,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          source: "session",
          sourceId: session.id,
          sourceName: session.title,
          userRole
        });
      }
    });
    
    // Sort by timestamp (newest first)
    return comments.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  const comments = generateSampleComments();
  
  const gameComments = comments.filter(c => c.source === "game");
  const sessionComments = comments.filter(c => c.source === "session");
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "presenter": return "bg-blue-100 text-blue-800";
      case "observer": return "bg-green-100 text-green-800";
      case "camper": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) return null;

  if (comments.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>User Comments</CardTitle>
          <CardDescription>
            Comments made by this user in games and classroom sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No comments from this user yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>User Comments</CardTitle>
        <CardDescription>
          Comments made by this user in games and classroom sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Comments ({comments.length})</TabsTrigger>
            <TabsTrigger value="games">Games ({gameComments.length})</TabsTrigger>
            <TabsTrigger value="sessions">Sessions ({sessionComments.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>User Role</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.map(comment => (
                  <TableRow key={comment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {comment.source === "game" ? (
                          <Gamepad className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>{comment.sourceName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeClass(comment.userRole)}>
                        {comment.userRole}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{comment.content}</TableCell>
                    <TableCell>{formatDate(comment.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="games">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Game</TableHead>
                  <TableHead>User Role</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gameComments.map(comment => (
                  <TableRow key={comment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Gamepad className="h-4 w-4 text-muted-foreground" />
                        <span>{comment.sourceName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeClass(comment.userRole)}>
                        {comment.userRole}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{comment.content}</TableCell>
                    <TableCell>{formatDate(comment.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="sessions">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>User Role</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionComments.map(comment => (
                  <TableRow key={comment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{comment.sourceName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeClass(comment.userRole)}>
                        {comment.userRole}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{comment.content}</TableCell>
                    <TableCell>{formatDate(comment.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
