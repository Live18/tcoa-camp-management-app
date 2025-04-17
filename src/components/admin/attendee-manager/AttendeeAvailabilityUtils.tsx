
import { useGame } from "@/contexts/GameContext";
import { useClassroomSession } from "@/contexts/ClassroomSessionContext";

export const useAttendeeAvailability = () => {
  const { isUserAvailableAt: isUserAvailableForGame } = useGame();
  const { isUserAvailableAt: isUserAvailableForSession } = useClassroomSession();
  
  // Default duration of 60 minutes for availability checks
  const defaultDuration = 60;
  
  const checkUserAvailability = (userId: string, eventDate: string) => {
    // Check availability in both games and sessions with default duration
    const availableForGame = isUserAvailableForGame(userId, eventDate, defaultDuration);
    const availableForSession = isUserAvailableForSession(userId, eventDate, defaultDuration);
    return availableForGame && availableForSession;
  };
  
  return {
    checkUserAvailability,
  };
};

export default useAttendeeAvailability;
