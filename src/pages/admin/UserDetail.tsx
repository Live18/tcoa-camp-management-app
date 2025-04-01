
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useGame } from "@/contexts/GameContext";
import { useClassroomSession, ClassroomSession } from "@/contexts/ClassroomSessionContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UserProfileCard } from "@/components/user/UserProfileCard";
import { UserAssignmentCard } from "@/components/user/UserAssignmentCard";
import { UserCommentsCard } from "@/components/user/UserCommentsCard";
import { UserNotFound } from "@/components/user/UserNotFound";

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { users, setUsers } = useUser();
  const { games } = useGame();
  const { sessions } = useClassroomSession();
  
  // Find the user by ID
  const user = users.find(user => user.id === id);

  // Get games assigned to this user
  const assignedGames = games.filter(game => 
    game.attendees.some(attendee => attendee.userId === id)
  );

  // Get sessions assigned to this user (now typed correctly)
  const assignedSessions: ClassroomSession[] = sessions.filter(session => 
    session.attendees.some(attendee => attendee.userId === id)
  );

  const handleDelete = () => {
    if (!user) return;
    
    // Delete user
    setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
    
    toast({
      title: "User Deleted",
      description: `${user.name} has been deleted from the system.`,
    });
    
    navigate("/admin/users");
  };

  // If user not found
  if (!user) {
    return <UserNotFound />;
  }

  return (
    <PermissionGate action="user.view">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/users")}
            className="px-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to User Management
          </Button>
          <h1 className="text-3xl font-bold">User Details</h1>
        </div>

        <UserProfileCard user={user} handleDelete={handleDelete} />
        
        <UserAssignmentCard 
          userId={id || ''} 
          assignedGames={assignedGames} 
          assignedSessions={assignedSessions} 
        />
        
        {/* Add the new UserCommentsCard component */}
        <UserCommentsCard userId={id || ''} />
      </div>
    </PermissionGate>
  );
};

export default UserDetail;
