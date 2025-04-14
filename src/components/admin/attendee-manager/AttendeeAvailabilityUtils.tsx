
import { useGame } from "@/contexts/GameContext";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";

export const useAttendeeAvailability = () => {
  const { isUserAvailableAt: isUserAvailableForGame } = useGame();
  const { isUserAvailableAt: isUserAvailableForSession } = useClassroomSession();
  
  const checkUserAvailability = (userId: string, eventDate: string | undefined) => {
    if (!eventDate) return true;
    
    // Default duration of 60 minutes
    const defaultDuration = 60;
    
    // Check availability in both games and sessions with the default duration
    const availableForGame = isUserAvailableForGame(userId, eventDate, defaultDuration);
    const availableForSession = isUserAvailableForSession(userId, eventDate, defaultDuration);
    
    return availableForGame && availableForSession;
  };
  
  return { checkUserAvailability };
};
