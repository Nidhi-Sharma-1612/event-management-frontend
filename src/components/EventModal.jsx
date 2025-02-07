/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  Box,
  Alert,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";

const EventModal = ({ open, onClose, onSubmit, eventData }) => {
  const [event, setEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    image: "",
  });

  const [error, setError] = useState("");

  // ✅ Convert ISO Date to "YYYY-MM-DD" when editing
  useEffect(() => {
    if (eventData) {
      setEvent({
        ...eventData,
        date: eventData.date ? eventData.date.split("T")[0] : "",
      });
    }
  }, [eventData]);

  const handleChange = (e) => {
    setEvent((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPEG, PNG, or WEBP images are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size should be less than 10MB");
      return;
    }

    // ✅ Create a preview URL
    const imageUrl = URL.createObjectURL(file);

    setEvent((prev) => ({
      ...prev,
      image: imageUrl, // ✅ Store preview URL for display
      imageFile: file, // ✅ Keep actual file for upload
    }));
  };

  // ✅ Handle Image Removal
  const handleRemoveImage = () => {
    setEvent({ ...event, image: "" });
  };
  const handleSubmit = () => {
    if (!event.title || !event.date || !event.location || !event.category) {
      setError("Please fill all required fields!");
      return;
    }

    // ✅ Convert date to ISO format before submitting
    const formattedEvent = {
      ...event,
      date: new Date(event.date).toISOString(),
    };

    onSubmit(formattedEvent);

    setEvent({
      title: "",
      description: "",
      date: "",
      location: "",
      category: "",
      image: "",
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{eventData ? "Edit Event" : "Create New Event"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Event Title"
          name="title"
          fullWidth
          variant="outlined"
          value={event.title}
          onChange={handleChange}
          sx={{ my: 2 }}
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={event.description}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          type="date"
          label="Date"
          name="date"
          fullWidth
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={event.date}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Location"
          name="location"
          fullWidth
          variant="outlined"
          value={event.location}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Select
          name="category"
          value={event.category}
          onChange={handleChange}
          fullWidth
          displayEmpty
          sx={{ mb: 2 }}
        >
          <MenuItem value="">Select Category</MenuItem>
          <MenuItem value="Technology">Technology</MenuItem>
          <MenuItem value="Music">Music</MenuItem>
          <MenuItem value="Business">Business</MenuItem>
          <MenuItem value="Education">Education</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>

        {/* ✅ Image Upload Section with Restrictions */}
        <Box className="flex flex-col">
          {error && <Alert severity="error">{error}</Alert>}
          {/* ✅ Show the preview of the uploaded image */}
          {event.image ? (
            <>
              <img
                src={event.image} // ✅ Use preview URL
                alt="Event Preview"
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <IconButton onClick={handleRemoveImage} color="error">
                <Delete />
              </IconButton>
            </>
          ) : (
            <Button variant="outlined" component="label" startIcon={<Add />}>
              Add Image
              <input type="file" hidden onChange={handleImageUpload} />
            </Button>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {eventData ? "Update Event" : "Create Event"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventModal;
