
import React from "react";
import { useNavigate } from "react-router-dom";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { useLocation } from "@/contexts/LocationContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";

const ClassroomSessionManagement = () => {
  const navigate = useNavigate();
  const { sessions, deleteSession } = useClassroomSession();
  const { getLocation } = useLocation();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleDelete = (id: string, title: string) => {
    deleteSession(id);
    toast({
      title: "Session Deleted",
      description: `${title} has been deleted.`,
    });
  };

  return (
    <PermissionGate action="session.view">
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin")}
              className="mb-2 px-0"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Classroom Session Management</h1>
          </div>
          
          <PermissionGate action="session.create" fallback={null}>
            <Button onClick={() => navigate("/admin/classroom-sessions/new")}>
              <Plus className="h-4 w-4 mr-2" /> Add Session
            </Button>
          </PermissionGate>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Classroom Sessions</CardTitle>
            <CardDescription>
              Manage all classroom sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Campers</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => {
                    const location = getLocation(session.locationId);
                    return (
                      <TableRow key={session.id} className="group">
                        <TableCell className="font-medium">
                          <Button 
                            variant="link" 
                            className="p-0 h-auto font-medium text-foreground hover:text-primary justify-start"
                            onClick={() => navigate(`/classroom-sessions/${session.id}`)}
                          >
                            {session.title}
                          </Button>
                        </TableCell>
                        <TableCell>
                          {location ? location.name : "Unknown"} - {session.roomName}
                        </TableCell>
                        <TableCell>{formatDate(session.date)}</TableCell>
                        <TableCell>{formatTime(session.date)}</TableCell>
                        <TableCell className="text-right">
                          {session.currentCampers} / {session.maxCampers}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => navigate(`/classroom-sessions/${session.id}`)}>
                                <Eye className="h-4 w-4 mr-2" /> View
                              </DropdownMenuItem>
                              <PermissionGate action="session.edit" fallback={null}>
                                <DropdownMenuItem onClick={() => navigate(`/admin/classroom-sessions/edit/${session.id}`)}>
                                  <Pencil className="h-4 w-4 mr-2" /> Edit
                                </DropdownMenuItem>
                              </PermissionGate>
                              <PermissionGate action="session.delete" fallback={null}>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the session "{session.title}".
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(session.id, session.title)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </PermissionGate>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No classroom sessions found</p>
                <PermissionGate action="session.create" fallback={null}>
                  <Button onClick={() => navigate("/admin/classroom-sessions/new")} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" /> Add Session
                  </Button>
                </PermissionGate>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
};

export default ClassroomSessionManagement;
