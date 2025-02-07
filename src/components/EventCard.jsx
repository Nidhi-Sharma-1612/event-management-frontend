/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import {
  LocationOn,
  Event as EventIcon,
  Description,
  Edit,
  Delete,
  Category,
  Group,
  Image as ImageIcon,
} from "@mui/icons-material";
import { io } from "socket.io-client";
import eventService from "../services/eventService";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
// ✅ Connect to WebSocket server
const socket = io(SOCKET_URL);

const EventCard = ({
  event,
  onEdit,
  onDelete,
  isGuest,
  borderColor,
  joinedEventId,
  setJoinedEventId,
}) => {
  const [joined, setJoined] = useState(joinedEventId === event._id);
  const [attendees, setAttendees] = useState(event.attendees || 0);
  const [loadingImage, setLoadingImage] = useState(true);
  const [eventImage, setEventImage] = useState(event.image);

  useEffect(() => {
    setEventImage(event.image);
    setLoadingImage(true);
  }, [event.image]);

  useEffect(() => {
    setJoined(joinedEventId === event._id);
  }, [joinedEventId, event._id]);

  // ✅ Listen for real-time attendee updates
  useEffect(() => {
    socket.on("updateAttendees", ({ eventId, attendees }) => {
      if (eventId === event._id) {
        setAttendees(attendees);
      }
    });

    return () => {
      socket.off("updateAttendees");
    };
  }, [event._id]);

  // ✅ Handle Join/Leave Click
  const handleJoinClick = async () => {
    try {
      if (joined) {
        const response = await eventService.leaveEvent(event._id);
        setJoined(false);
        setJoinedEventId(null);
        localStorage.removeItem("joinedEventId");
      } else {
        if (joinedEventId) {
          alert("❌ You can only join one event at a time!");
          return;
        }

        const response = await eventService.joinEvent(event._id);
        setJoined(true);
        setJoinedEventId(event._id);
        localStorage.setItem("joinedEventId", event._id);
      }
    } catch (error) {
      console.error(
        `❌ Error ${joined ? "leaving" : "joining"} event:`,
        error.response?.data || error
      );
    }
  };

  // ✅ Handle Image Load & Error
  const handleImageLoad = () => {
    setLoadingImage(false);
  };

  const handleImageError = () => {
    setLoadingImage(false);
    setEventImage(null); // ✅ Set image to null to show default icon
  };

  return (
    <Card className={`shadow-md border-l-4 ${borderColor} rounded-lg`}>
      <CardContent className="space-y-4">
        {/* Title & Actions */}
        <div className="flex justify-between items-center">
          <Typography variant="h6" className="font-semibold">
            {event.title}
          </Typography>

          <div className="flex items-center gap-2">
            {/* ✅ "Join" / "Leave" button for Guests & Live Events */}
            {isGuest && borderColor === "border-green-500" && (
              <Button
                variant="contained"
                onClick={handleJoinClick}
                disabled={
                  !joined && joinedEventId && joinedEventId !== event._id
                }
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  py: 0.8,
                  backgroundColor: joined ? "red" : "green",
                  "&:hover": {
                    backgroundColor: joined ? "darkred" : "darkgreen",
                  },
                }}
              >
                {joined ? "Leave" : "Join"}
              </Button>
            )}

            {/* Edit/Delete Buttons (Hidden for guests) */}
            {!isGuest && (
              <>
                <IconButton
                  onClick={() => onEdit(event)}
                  sx={{ color: "blue" }}
                  size="small"
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => onDelete(event._id)}
                  sx={{ color: "red" }}
                  size="small"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </>
            )}
          </div>
        </div>

        {/* ✅ Event Image with Loader */}
        <div className="relative w-full flex justify-center items-center">
          {loadingImage && (
            <div className="absolute flex justify-center items-center bg-gray-200 w-full h-[200px] rounded-md">
              <CircularProgress size={40} />
            </div>
          )}

          {eventImage ? (
            <CardMedia
              component="img"
              height="200"
              image={`${eventImage}?t=${Date.now()}`}
              alt={event.title}
              className="rounded-md object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ display: loadingImage ? "none" : "block" }}
            />
          ) : (
            <div
              className="flex justify-center items-center bg-gray-200 rounded-md"
              style={{
                width: "100%",
                maxWidth: "300px",
                height: "200px",
              }}
            >
              <ImageIcon fontSize="large" className="text-gray-500" />
            </div>
          )}
        </div>

        {/* Row 1: Date & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <EventIcon className="text-gray-500" fontSize="small" />
            <Typography variant="body2" className="text-gray-600">
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Typography>
          </div>
          <div className="flex items-center space-x-2">
            <LocationOn className="text-gray-500" fontSize="small" />
            <Typography variant="body2" className="text-gray-600">
              {event.location}
            </Typography>
          </div>
        </div>

        {/* Row 2: Category & Attendees */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Category className="text-gray-500" fontSize="small" />
            <Typography variant="body2" className="text-gray-600">
              {event.category}
            </Typography>
          </div>
          <div className="flex items-center space-x-2">
            <Group className="text-gray-500" fontSize="small" />
            <Typography variant="body2" className="text-gray-600">
              {attendees} {/* ✅ Show real-time attendee count */}
            </Typography>
          </div>
        </div>

        {/* Row 3: Description */}
        <div className="flex items-center space-x-2">
          <Description className="text-gray-500" fontSize="small" />
          <Typography variant="body2" className="text-gray-700">
            {event.description || "-"}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
