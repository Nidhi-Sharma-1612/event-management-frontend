import axiosClient from "../api/axiosClient";

const eventService = {
  getEvents: async () => {
    try {
      const response = await axiosClient.get("/events", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Send user's token
        },
      });

      return response.data;
    } catch (error) {
      console.error("❌ Error fetching events:", error.response?.data || error);
      throw error;
    }
  },

  createEvent: async (eventData) => {
    try {
      const formData = new FormData();

      // ✅ Append all fields
      Object.keys(eventData).forEach((key) => {
        if (key === "imageFile" && eventData[key]) {
          formData.append("image", eventData[key]);
        } else if (eventData[key]) {
          formData.append(key, eventData[key]);
        }
      });

      const response = await axiosClient.post("/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("❌ Error Creating Event:", error.response?.data || error);
      throw error;
    }
  },

  updateEvent: async (eventId, eventData) => {
    try {
      const formData = new FormData();

      Object.keys(eventData).forEach((key) => {
        if (key === "imageFile" && eventData[key]) {
          formData.append("image", eventData[key]);
        } else if (eventData[key]) {
          formData.append(key, eventData[key]);
        }
      });

      const response = await axiosClient.put(`/events/${eventId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("❌ Error Updating Event:", error.response?.data || error);
      throw error;
    }
  },

  deleteEvent: async (eventId) => {
    try {
      const response = await axiosClient.delete(`/events/${eventId}`);

      return response.data;
    } catch (error) {
      console.error("❌ Error Deleting Event:", error.response?.data || error);

      if (error.response?.status === 400) {
        alert("Cannot delete this event. Creator information is missing.");
      } else if (error.response?.status === 403) {
        alert("You are not authorized to delete this event.");
      } else {
        alert(error.response?.data?.message || "Failed to delete event");
      }

      throw error;
    }
  },

  joinEvent: (eventId) => axiosClient.post(`/events/join/${eventId}`),
  leaveEvent: (eventId) => axiosClient.post(`/events/leave/${eventId}`),
};

export default eventService;
