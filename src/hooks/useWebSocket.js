import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// WebSocket Server URL (Replace with actual backend URL)
const SOCKET_SERVER_URL = "http://localhost:5000";

const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);

    newSocket.on("connect", () => {
      console.log("✅ Connected to WebSocket Server");
    });

    // Listen for event updates
    newSocket.on("updateEvents", (updatedEvents) => {
      setEvents(updatedEvents);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Function to Join an Event
  const joinEvent = (eventId) => {
    if (socket) {
      socket.emit("joinEvent", eventId);
    }
  };

  return { events, joinEvent };
};

export default useWebSocket;
