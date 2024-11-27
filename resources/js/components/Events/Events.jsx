import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Box, Typography, Button } from "@mui/material";
import apiClient from "../../utils/axios";
import EventForm from "./EventForm";
import EventList from "./EventList";

const Events = () => {
    const [showForm, setShowForm] = useState(false); // Controls form visibility

    const handleEventSubmit = async (eventData) => {
        try {
            await apiClient.post(`/api/events/save`, eventData);
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
