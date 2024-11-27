import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Box, Typography, Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import apiClient from "../../utils/axios";
import EventForm from "./EventForm";
import EventList from "./EventList";

const Events = () => {
    const [showForm, setShowForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    const handleEventSubmit = async (eventData) => {
        setIsSaving(true);
        try {
            await apiClient.post(`/api/events/save`, eventData);
            setShowForm(false);
            setShowNotification(true);
        } catch (error) {
            console.error("Error creating event:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
            {showForm ? (
                isSaving ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <EventForm
                        onSubmit={handleEventSubmit}
                        onCancel={() => setShowForm(false)}
                    />
                )
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

            {/* Snackbar for success notification */}
            <Snackbar
                open={showNotification}
                autoHideDuration={3000}
                onClose={() => setShowNotification(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setShowNotification(false)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    Event successfully added!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Events;
