import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Box, Typography, Button } from "@mui/material";
import axios from "axios";
import EventForm from "./EventForm";
import EventList from "./EventList";

const apiUrl = import.meta.env.VITE_API_URL;

const Events = () => {
    const [showForm, setShowForm] = useState(false); // Controls form visibility

    const handleEventSubmit = async (eventData) => {
        try {
            await axios.post(`${apiUrl}/api/events/save`, eventData);
            setShowForm(false);
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
            {showForm ? (
                <EventForm
                    onSubmit={handleEventSubmit}
                    onCancel={() => setShowForm(false)}
                />
            ) : (
                <>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h4" sx={{ mb: 3 }}>
                            Events
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => setShowForm(true)}
                        >
                            Add Event
                        </Button>
                    </Box>
                    <EventList />
                </>
            )}
        </Box>
    );
};

export default Events;
