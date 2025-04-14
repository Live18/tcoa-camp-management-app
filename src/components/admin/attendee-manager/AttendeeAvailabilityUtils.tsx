
import { useGame } from "@/contexts/GameContext";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";

export const useAttendeeAvailability = () => {
  const { isUserAvailableAt: isUserAvailableForGame } = useGame();
  const { isUserAvailableAt: isUserAvailableForSession } = useClassroomSession();
  
  const checkUserAvailability = (userId: string, eventDate: string | undefined) => {
    if (!eventDate) return true;
    
    // Check availability in both games and sessions
    const availableForGame = isUserAvailableForGame(userId, eventDate);
    const availableForSession = isUserAvailableForSession(userId, eventDate);
    
    return availableForGame && availableForSession;
  };
  
  return { checkUserAvailability };
};
