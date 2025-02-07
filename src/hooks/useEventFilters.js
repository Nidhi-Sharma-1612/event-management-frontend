/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useMemo } from "react";
import eventService from "../services/eventService";

const useEventFilters = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // ✅ Fetch Events Once on Mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await eventService.getEvents();

      if (!response || !Array.isArray(response)) {
        console.error("❌ Invalid events response:", response);
        return;
      }

      let formattedEvents = response.map((event) => ({
        ...event,
        category: event.category || "Uncategorized",
      }));

      const user = JSON.parse(localStorage.getItem("user")) || {};
      const isGuest = user.role === "guest";

      if (!isGuest) {
        // ✅ If Authenticated, Show Only Their Events
        formattedEvents = formattedEvents.filter(
          (event) => event.createdBy?._id === user._id
        );
      }

      setEvents(formattedEvents);
      setFilteredEvents(formattedEvents);
    } catch (error) {
      console.error("❌ Error fetching events:", error);
    }
  }, []);

  // ✅ Categorize Events (Live, Upcoming, Past)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date

  const upcomingEvents = useMemo(
    () =>
      filteredEvents.filter((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate > today; // ✅ Future events
      }),
    [filteredEvents]
  );

  const liveEvents = useMemo(
    () =>
      filteredEvents.filter((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === today.getTime(); // ✅ Events happening today
      }),
    [filteredEvents]
  );

  const pastEvents = useMemo(
    () =>
      filteredEvents.filter((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < today; // ✅ Past events
      }),
    [filteredEvents]
  );

  // ✅ Filter Events Based on Category & Date
  useEffect(() => {
    let filtered = [...events];

    if (selectedCategory) {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory
      );
    }

    if (selectedDate) {
      const selectedDateUTC = new Date(selectedDate);
      selectedDateUTC.setHours(0, 0, 0, 0);

      filtered = filtered.filter((event) => {
        const eventDateUTC = new Date(event.date);
        eventDateUTC.setHours(0, 0, 0, 0);
        return eventDateUTC.getTime() === selectedDateUTC.getTime();
      });
    }

    setFilteredEvents(filtered);
  }, [events, selectedCategory, selectedDate]);

  return {
    events,
    setEvents,
    filteredEvents,
    categories: [
      ...new Set(events.map((event) => event.category).filter(Boolean)),
    ],
    selectedCategory,
    setSelectedCategory,
    selectedDate,
    setSelectedDate,
    fetchEvents,
    upcomingEvents,
    liveEvents,
    pastEvents,
  };
};

export default useEventFilters;
