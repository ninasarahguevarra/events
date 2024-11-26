import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import {
    DateTimePicker,
    LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const EventList = () => {
    const [events, setEvents] = useState([]); // Stores all created events
    const [showForm, setShowForm] = useState(false); // Controls form visibility
    const [eventData, setEventData] = useState({
        name: "",
        description: "",
        location: "",
        date: "", // "2024-11-25T19:00:00.000Z"
        status: true,
        image: "",
    });

    const handleChange = (event) => {
        setEventData({ ...eventData, [event.target.name]: event.target.value });
    };

    const handleDateChange = (newDate) => {
        setEventData({ ...eventData, date: newDate });
    };

    const handleTimeChange = (newTime) => {
        setEventData({ ...eventData, time: newTime });
    };

    const handleStatusChange = (event) => {
        setEventData({ ...eventData, status: event.target.checked });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setEvents([...events, eventData]); // Add new event to list
        setEventData({
            // Reset form data
            name: "",
            description: "",
            location: "",
            date: null,
            time: null,
            status: true,
            image: "",
        });
        setShowForm(false); // Hide form after submission
    };

    const toggleForm = () => {
        setShowForm(!showForm); // Toggle form visibility
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
            {showForm ? (
                <EventForm
                    eventData={eventData}
                    handleChange={handleChange}
                    handleDateChange={handleDateChange}
                    handleTimeChange={handleTimeChange}
                    handleStatusChange={handleStatusChange}
                    handleSubmit={handleSubmit}
                />
            ) : (
                <>
                    <Typography variant="h4" sx={{ mb: 3 }}>
                        Events
                    </Typography>
                    {events.length > 0 ? (
                        <Box>
                            {events.map((event, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Typography variant="body1">
                                        <strong>{event.name}</strong> -{" "}
                                        {event.date?.format("YYYY-MM-DD")}{" "}
                                        {event.time?.format("HH:mm")}
                                    </Typography>
                                    <Typography variant="caption">
                                        Location: {event.location}
                                    </Typography>
                                    <Typography variant="body2">
                                        {event.description}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body1">
                            No events created yet.
                        </Typography>
                    )}
                    <Button
                        sx={{ mt: 2 }}
                        variant="contained"
                        onClick={toggleForm}
                    >
                        Add Event
                    </Button>
                </>
            )}
        </Box>
    );
};

const EventForm = ({
    eventData,
    handleChange,
    handleDateChange,
    handleTimeChange,
    handleStatusChange,
    handleSubmit,
}) => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: "600px",
            mx: "auto",
            mt: 3,
            p: 3,
            bgcolor: "#fff",
            boxShadow: 3,
        }}
    >
        <Typography variant="h4" sx={{ mb: 3 }}>
            Create Event
        </Typography>
        <form onSubmit={handleSubmit}>
            <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={eventData.name}
                onChange={handleChange}
                name="name"
                size="small"
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Description"
                variant="outlined"
                value={eventData.description}
                onChange={handleChange}
                name="description"
                multiline
                rows={2}
                size="small"
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Location"
                variant="outlined"
                value={eventData.location}
                onChange={handleChange}
                name="location"
                size="small"
                sx={{ mb: 2 }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <DateTimePicker
                        label="Date"
                        value={eventData.date}
                        onChange={handleDateChange}
                    />
                </Box>
            </LocalizationProvider>
            <TextField
                fullWidth
                label="Image URL"
                variant="outlined"
                value={eventData.image}
                onChange={handleChange}
                name="image"
                size="small"
                sx={{ mb: 2 }}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={eventData.status}
                        onChange={handleStatusChange}
                    />
                }
                label="Active"
            />
            <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 2 }}
            >
                Create Event
            </Button>
        </form>
    </Box>
);

export default EventList;
