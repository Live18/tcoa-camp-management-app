import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useGame } from "@/contexts/GameContext";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";
import { useLocation } from "@/contexts/LocationContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, AlertTriangle, CheckCircle, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";

const EndCamp = () => {
  const navigate = useNavigate();
  const { users, setUsers } = useUser();
  const { games, setGames } = useGame();
  const { sessions, setSessions } = useClassroomSession();
  const { locations, setLocations } = useLocation();
  
  const [isDataDownloaded, setIsDataDownloaded] = useState(false);
  const [exportFormat, setExportFormat] = useState<"excel" | "sheets">("excel");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Count all the data that will be deleted
  const campersCount = users.filter(u => u.role === "camper").length;
  const observersCount = users.filter(u => u.role === "observer").length;
  const presentersCount = users.filter(u => u.role === "presenter").length;
  const gamesCount = games.length;
  const sessionsCount = sessions.length;
  const locationsCount = locations.length;

  // Export data to CSV format (which can be opened by Excel or Google Sheets)
  const exportData = () => {
    // Prepare CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Headers
    csvContent += "Type,ID,Name,Role,Email,Phone,Location,Title,Description,Date,Feedback,Comments\n";
    
    // Add user data
    users.forEach(user => {
      const row = [
        "User",
        user.id,
        user.name,
        user.role,
        user.email,
        user.phone || "",
        "",
        "",
        user.bio || "",
        "",
        user.feedback || "",
        user.comments || ""
      ];
      csvContent += row.map(cell => `"${cell}"`).join(",") + "\n";
    });
    
    // Add location data
    locations.forEach(location => {
      const row = [
        "Location",
        location.id,
        location.name,
        "",
        "",
        "",
        `${location.address}, ${location.city}, ${location.state} ${location.zipCode}`,
        "",
        location.notes || "",
        "",
        "",
        ""
      ];
      csvContent += row.map(cell => `"${cell}"`).join(",") + "\n";
    });
    
    // Add game data
    games.forEach(game => {
      const location = locations.find(loc => loc.id === game.locationId);
      const row = [
        "Game",
        game.id,
        "",
        "",
        "",
        "",
        location?.name || "",
        game.title,
        game.description,
        game.date,
        "",
        ""
      ];
      csvContent += row.map(cell => `"${cell}"`).join(",") + "\n";
      
      // Add attendees for this game
      game.attendees.forEach(attendee => {
        const user = users.find(u => u.id === attendee.userId);
        if (user) {
          const row = [
            "GameAttendee",
            game.id,
            user.name,
            user.role,
            user.email,
            user.phone || "",
            location?.name || "",
            game.title,
            "",
            game.date,
            user.feedback || "",
            user.comments || ""
          ];
          csvContent += row.map(cell => `"${cell}"`).join(",") + "\n";
        }
      });
    });
    
    // Add session data
    sessions.forEach(session => {
      const location = locations.find(loc => loc.id === session.locationId);
      const row = [
        "Session",
        session.id,
        "",
        "",
        "",
        "",
        location?.name || "",
        session.title,
        session.description,
        session.date,
        "",
        ""
      ];
      csvContent += row.map(cell => `"${cell}"`).join(",") + "\n";
      
      // Add attendees for this session
      session.attendees.forEach(attendee => {
        const user = users.find(u => u.id === attendee.userId);
        if (user) {
          const row = [
            "SessionAttendee",
            session.id,
            user.name,
            user.role,
            user.email,
            user.phone || "",
            location?.name || "",
            session.title,
            "",
            session.date,
            user.feedback || "",
            user.comments || ""
          ];
          csvContent += row.map(cell => `"${cell}"`).join(",") + "\n";
        }
      });
    });
    
    // Create download link and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    
    // Set file name based on chosen format
    const fileName = exportFormat === "excel" ? "camp_data.csv" : "camp_data.csv";
    link.setAttribute("download", fileName);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsDataDownloaded(true);
    toast({
      title: "Data Exported Successfully",
      description: `Camp data has been exported as ${fileName}`,
    });
  };

  // Delete all non-admin data
  const endCamp = () => {
    // Keep only admin users
    setUsers(prevUsers => prevUsers.filter(user => user.isAdmin || user.role === "admin"));
    
    // Delete all games
    setGames([]);
    
    // Delete all sessions
    setSessions([]);
    
    // Delete all locations
    setLocations([]);
    
    toast({
      title: "Camp Ended Successfully",
      description: "All camp data has been deleted. Admin accounts have been preserved.",
    });
    
    navigate("/admin");
  };

  return (
    <PermissionGate action="admin.manage">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin")}
            className="px-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">End Camp</h1>
        </div>

        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-800">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Warning: This Action Cannot Be Undone
            </CardTitle>
            <CardDescription className="text-red-700">
              Ending the camp will permanently delete all data except admin accounts.
              Please make sure to download a backup before proceeding.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Step 1: Download Camp Data</CardTitle>
            <CardDescription>
              Export all camp data to a spreadsheet before deleting it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="mb-2 font-medium">This export will include:</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>All users (campers, observers, presenters)</li>
                <li>All locations</li>
                <li>All games and their attendees</li>
                <li>All classroom sessions and their attendees</li>
                <li>All feedback and comments</li>
              </ul>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-40">
                <Select
                  value={exportFormat}
                  onValueChange={(value) => setExportFormat(value as "excel" | "sheets")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">Excel (.csv)</SelectItem>
                    <SelectItem value="sheets">Google Sheets (.csv)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={exportData}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download Data
              </Button>
              
              {isDataDownloaded && (
                <span className="flex items-center text-green-600">
                  <CheckCircle className="mr-1 h-4 w-4" /> Downloaded
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: End the Camp</CardTitle>
            <CardDescription>
              This will permanently delete all non-admin data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="mb-2 font-medium">This will delete:</p>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <li className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-100">
                  <span>Campers</span>
                  <span className="font-medium">{campersCount}</span>
                </li>
                <li className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-100">
                  <span>Observers</span>
                  <span className="font-medium">{observersCount}</span>
                </li>
                <li className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-100">
                  <span>Presenters</span>
                  <span className="font-medium">{presentersCount}</span>
                </li>
                <li className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-100">
                  <span>Games</span>
                  <span className="font-medium">{gamesCount}</span>
                </li>
                <li className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-100">
                  <span>Classroom Sessions</span>
                  <span className="font-medium">{sessionsCount}</span>
                </li>
                <li className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-100">
                  <span>Locations</span>
                  <span className="font-medium">{locationsCount}</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive"
                  className="gap-2"
                  disabled={!isDataDownloaded}
                >
                  <AlertTriangle className="h-4 w-4" />
                  End Camp
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action is irreversible. It will permanently delete:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>{campersCount} campers</li>
                      <li>{observersCount} observers</li>
                      <li>{presentersCount} presenters</li>
                      <li>{gamesCount} games</li>
                      <li>{sessionsCount} classroom sessions</li>
                      <li>{locationsCount} locations</li>
                    </ul>
                    {!isDataDownloaded && (
                      <p className="mt-2 font-medium text-red-600">
                        You haven't downloaded the data backup yet!
                      </p>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={endCamp}
                    className="bg-destructive hover:bg-destructive/90"
                    disabled={!isDataDownloaded}
                  >
                    {isDataDownloaded ? (
                      "Yes, End Camp"
                    ) : (
                      "Download Data First"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {!isDataDownloaded && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="destructive"
                    className="gap-2 ml-2"
                  >
                    <X className="h-4 w-4" />
                    Skip Download
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Download Strongly Recommended</DialogTitle>
                    <DialogDescription>
                      You're about to delete all camp data without downloading a backup first.
                      This data cannot be recovered once deleted.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-4 my-4">
                    <p className="font-medium text-yellow-800 flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Are you sure you want to proceed without a backup?
                    </p>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Go Back and Download</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          setIsDataDownloaded(true);
                          setIsConfirmOpen(true);
                        }}
                      >
                        Continue Without Backup
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardFooter>
        </Card>
      </div>
    </PermissionGate>
  );
};

export default EndCamp;
