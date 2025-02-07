/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import useEventFilters from "../hooks/useEventFilters";
import eventService from "../services/eventService";
import EventCard from "../components/EventCard";
import EventFilters from "../components/EventFilters";
import EventModal from "../components/EventModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import useWebSocket from "../hooks/useWebSocket";
import useLeaveEventOnUnload from "../hooks/useLeaveEventOnUnload";

const EventDashboard = () => {
  const {
    categories,
    selectedCategory,
    selectedDate,
    setSelectedCategory,
    setSelectedDate,
    fetchEvents,
    upcomingEvents,
    liveEvents,
    pastEvents,
    setEvents,
  } = useEventFilters();

  const [openModal, setOpenModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [joinedEventId, setJoinedEventId] = useState(
    localStorage.getItem("joinedEventId") || null
  );

  // ✅ Check if user is a guest
  const user = JSON.parse(localStorage.getItem("user"));
  const isGuest = user?.role === "guest";

  useLeaveEventOnUnload(isGuest, joinedEventId, setJoinedEventId);

  const handleCreateEvent = async (newEvent) => {
    try {
      if (!newEvent.date) {
        console.error("❌ Missing or Invalid Date:", newEvent.date);
        alert("Please select a valid event date!");
        return;
      }

      const eventDate = new Date(newEvent.date);
      if (isNaN(eventDate.getTime())) {
        console.error("❌ Invalid Date Format:", newEvent.date);
        alert("Invalid date format! Please select a valid date.");
        return;
      }

      const formattedEvent = { ...newEvent, date: eventDate.toISOString() };

      const createdEvent = await eventService.createEvent(formattedEvent);

      if (!createdEvent) {
        console.error("❌ Event Creation Failed: No Data Returned");
        alert("Something went wrong. Please try again.");
        return;
      }

      setEvents((prevEvents) => [...prevEvents, createdEvent]);
      setOpenModal(false);
      fetchEvents();
    } catch (error) {
      console.error("❌ Error creating event:", error.response?.data || error);
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setOpenModal(true);
  };
  const handleEditEvent = async (updatedEvent) => {
    try {
      if (!editingEvent || !editingEvent._id) {
        console.error("❌ Missing event ID! Check eventData in EventModal.");
        return;
      }

      // ✅ Optimistically update UI before API call
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === editingEvent._id ? { ...event, ...updatedEvent } : event
        )
      );

      // ✅ Send update request to backend
      const response = await eventService.updateEvent(
        editingEvent._id,
        updatedEvent
      );

      if (response.event.image) {
        // ✅ Ensure UI uses the updated Cloudinary image URL
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === editingEvent._id
              ? { ...event, image: response.event.image }
              : event
          )
        );
      }

      // ✅ Close modal and reset editing state
      setEditingEvent(null);
      setOpenModal(false);
    } catch (error) {
      console.error("❌ Error updating event:", error);
    }
  };

  const handleImageUpdate = async (eventId, newImage) => {
    try {
      const response = await eventService.updateEvent(eventId, {
        image: newImage,
      });

      // ✅ Update event list instantly in UI
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? { ...event, image: response.data.event.image }
            : event
        )
      );
    } catch (error) {
      console.error("❌ Error updating image:", error);
    }
  };

  const handleDeleteConfirmation = (eventId) => {
    setEventToDelete(eventId);
    setDeleteModalOpen(true);
  };

  const handleDeleteEvent = async () => {
    try {
      await eventService.deleteEvent(eventToDelete);

      // ✅ Optimistically remove event from UI
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventToDelete)
      );

      setDeleteModalOpen(false);
    } catch (error) {
      console.error("❌ Error deleting event:", error.response?.data || error);
      alert("Failed to delete event. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      {/* Filters & Create Button */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <EventFilters
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        {!isGuest && (
          <Button
            variant="contained"
            onClick={() => setOpenModal(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              height: 40,
              backgroundColor: "blue",
              "&:hover": { backgroundColor: "darkblue" },
              fontSize: { xs: "12px", sm: "14px" },
            }}
          >
            <Add fontSize="small" />
            Create Event
          </Button>
        )}
      </div>

      {/* Live Events */}
      <section className="mt-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-green-600">
          Live Events 🎉
        </h2>
        {liveEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isGuest={isGuest}
                onEdit={handleEditClick}
                onDelete={handleDeleteConfirmation}
                borderColor="border-green-500"
                setJoinedEventId={setJoinedEventId}
                joinedEventId={joinedEventId}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm md:text-base">
            No live events happening today.
          </p>
        )}
      </section>

      {/* Upcoming Events */}
      <section className="mt-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          Upcoming Events
        </h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isGuest={isGuest}
                onEdit={handleEditClick}
                onDelete={handleDeleteConfirmation}
                borderColor="border-blue-500"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm md:text-base">
            No upcoming events.
          </p>
        )}
      </section>

      {/* Past Events */}
      <section className="mt-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-600">
          Past Events
        </h2>
        {pastEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isGuest={isGuest}
                onEdit={handleEditEvent}
                onDelete={handleDeleteConfirmation}
                borderColor="border-gray-400"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm md:text-base">No past events.</p>
        )}
      </section>

      {/* Modals */}
      <EventModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingEvent(null);
        }}
        onSubmit={editingEvent ? handleEditEvent : handleCreateEvent}
        eventData={editingEvent}
        onImageUpdate={handleImageUpdate}
      />

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteEvent}
      />
    </div>
  );
};

export default EventDashboard;
