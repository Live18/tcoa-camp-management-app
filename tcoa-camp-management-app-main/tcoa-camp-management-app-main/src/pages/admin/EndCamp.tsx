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
import * as XLSX from "xlsx";

const EndCamp = () => {
  const navigate = useNavigate();
  const { users, setUsers } = useUser();
  const { games, setGames } = useGame();
  const { sessions, setSessions } = useClassroomSession();
  const { locations, setLocations } = useLocation();
  
  const [isDataDownloaded, setIsDataDownloaded] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Count all the data that will be deleted
  const campersCount = users.filter(u => u.role === "camper").length;
  const observersCount = users.filter(u => u.role === "observer").length;
  const presentersCount = users.filter(u => u.role === "presenter").length;
  const gamesCount = games.length;
  const sessionsCount = sessions.length;
  const locationsCount = locations.length;

  const exportData = async () => {
    const wb = XLSX.utils.book_new();

    // --- Users tab ---
    const usersData = users.map(user => ({
      ID: user.id,
      Name: user.name,
      Role: user.role,
      Email: user.email,
      Phone: user.phone || "",
      Bio: user.bio || "",
      Feedback: user.feedback || "",
      Comments: user.comments || "",
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(usersData), "Users");

    // --- Locations tab ---
    const locationsData = locations.map(loc => ({
      ID: loc.id,
      Name: loc.name,
      Address: loc.address,
      City: loc.city,
      State: loc.state,
      Zip: loc.zipCode,
      Notes: loc.notes || "",
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(locationsData), "Locations");

    // --- Games tab ---
    const gamesData = games.map(game => ({
      ID: game.id,
      Title: game.title,
      Description: game.description,
      Date: game.date,
      Location: locations.find(l => l.id === game.locationId)?.name || "",
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(gamesData), "Games");

    // --- Game Attendees tab ---
    const gameAttendeesData: object[] = [];
    games.forEach(game => {
      const locName = locations.find(l => l.id === game.locationId)?.name || "";
      game.attendees.forEach(attendee => {
        const user = users.find(u => u.id === attendee.userId);
        if (user) {
          gameAttendeesData.push({
            "Game Title": game.title,
            Date: game.date,
            Location: locName,
            "Attendee Name": user.name,
            Role: user.role,
            Email: user.email,
            Phone: user.phone || "",
            Feedback: user.feedback || "",
            Comments: user.comments || "",
          });
        }
      });
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(gameAttendeesData), "Game Attendees");

    // --- Sessions tab ---
    const sessionsData = sessions.map(session => ({
      ID: session.id,
      Title: session.title,
      Description: session.description,
      Date: session.date,
      Location: locations.find(l => l.id === session.locationId)?.name || "",
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sessionsData), "Sessions");

    // --- Session Attendees tab ---
    const sessionAttendeesData: object[] = [];
    sessions.forEach(session => {
      const locName = locations.find(l => l.id === session.locationId)?.name || "";
      session.attendees.forEach(attendee => {
        const user = users.find(u => u.id === attendee.userId);
        if (user) {
          sessionAttendeesData.push({
            "Session Title": session.title,
            Date: session.date,
            Location: locName,
            "Attendee Name": user.name,
            Role: user.role,
            Email: user.email,
            Phone: user.phone || "",
            Feedback: user.feedback || "",
            Comments: user.comments || "",
          });
        }
      });
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sessionAttendeesData), "Session Attendees");

    // Write workbook to binary array
    const wbArray = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const fileName = "camp_data.xlsx";

    // Use File System Access API (Save As dialog) if available, fallback to link download
    if ("showSaveFilePicker" in window) {
      try {
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: [{ description: "Excel Workbook", accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] } }],
        });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      } catch (err: any) {
        // User cancelled the dialog — do nothing
        if (err?.name === "AbortError") return;
        throw err;
      }
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    setIsDataDownloaded(true);
    toast({
      title: "Data Exported Successfully",
      description: "Camp data has been saved as camp_data.xlsx",
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
              <p className="mb-2 font-medium">This export will include 6 tabs:</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li><strong>Users</strong> — all campers, observers, and presenters</li>
                <li><strong>Locations</strong> — all location records</li>
                <li><strong>Games</strong> — all games</li>
                <li><strong>Game Attendees</strong> — per-game attendance with feedback</li>
                <li><strong>Sessions</strong> — all classroom sessions</li>
                <li><strong>Session Attendees</strong> — per-session attendance with feedback</li>
              </ul>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={exportData}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download Excel (.xlsx)
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
