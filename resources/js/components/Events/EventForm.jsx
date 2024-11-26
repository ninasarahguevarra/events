import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const EventForm = ({ onSubmit, onCancel }) => {
    const [eventData, setEventData] = useState({
        name: "",
        description: "",
        location: "",
        date: dayjs(), // Default to the current date and time
    });

    const handleChange = (event) => {
        setEventData({ ...eventData, [event.target.name]: event.target.value });
    };

    const handleDateChange = (newDate) => {
        setEventData({ ...eventData, date: newDate });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({
            name: eventData.name,
            description: eventData.description,
            location: eventData.location,
            date: eventData.date.toISOString(), // Format date to ISO string for the API
        });
    };

    return (
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
                    <DateTimePicker
                        label="Date"
                        value={eventData.date}
                        onChange={handleDateChange}
                        sx={{ mb: 2 }}
                    />
                </LocalizationProvider>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <Button variant="outlined" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" type="submit">
                        Create Event
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default EventForm;
