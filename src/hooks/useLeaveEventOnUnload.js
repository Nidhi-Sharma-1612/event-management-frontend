import { useEffect } from "react";
import eventService from "../services/eventService";

const useLeaveEventOnUnload = (isGuest, joinedEventId, setJoinedEventId) => {
  useEffect(() => {
    const handleUnload = async () => {
      if (isGuest && joinedEventId) {
        console.log(
          "📤 Guest is leaving event before closing or reloading the window:",
          joinedEventId
        );

        // Remove joinedEventId from localStorage
        localStorage.removeItem("joinedEventId");

        try {
          // Send request to leave event and decrease attendee count
          await eventService.leaveEvent(joinedEventId);
        } catch (error) {
          console.error(
            "❌ Error leaving event on window close/reload:",
            error
          );
        }

        // Reset state (UI will update on next mount)
        setJoinedEventId(null);
      }
    };

    // ✅ Trigger on both beforeunload (close) and unload (reload)
    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [isGuest, joinedEventId, setJoinedEventId]);
};

export default useLeaveEventOnUnload;
