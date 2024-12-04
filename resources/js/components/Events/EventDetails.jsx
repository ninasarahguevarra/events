import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../utils/authUtils";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Tab,
    Tabs,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [eventData, setEventData] = useState(null);
    const [registrants, setRegistrants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);
    dayjs.extend(utc);
    dayjs.extend(timezone);

    const manilaTimeZone = "Asia/Manila";

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await apiClient.get(
                    `/api/events/show/${id}`
                );
                const { event, registrant } = response.data.data;
                setEventData(event);

                setRegistrants(registrant);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };

        fetchEventDetails();
    }, [id]);

    const handleInputChange = (field, value) => {
        setEventData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleUpdate = async () => {
        try {
            const response = await apiClient.post(
                `/api/events/update/${id}`,
                {
                    ...eventData,
                    registrants,
                }
            );
            if (response.data.success) {
                navigate("/events");
            }
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const filteredRegistrants =
        tabIndex === 1 ? registrants.filter((r) => r.is_attended) : registrants;

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Event Details
            </Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box>
                    <TextField
                        label="Event Name"
                        value={eventData.name}
                        onChange={(e) =>
                            handleInputChange("name", e.target.value)
                        }
                        slotProps={{
                            input: {
                              readOnly: true,
                            },
                          }}
                
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Location"
                        value={eventData.location}
                        onChange={(e) =>
                            handleInputChange("location", e.target.value)
                        }
                        slotProps={{
                            input: {
                              readOnly: true,
                            },
                          }}
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Description"
                        value={eventData.description}
                        onChange={(e) =>
                            handleInputChange("description", e.target.value)
                        }
                        slotProps={{
                            input: {
                              readOnly: true,
                            },
                          }}
                        fullWidth
                        multiline
                        rows={2}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Date"
                        type="datetime-local"
                        value={dayjs(eventData.date)
                            .tz(manilaTimeZone)
                            .format("YYYY-MM-DDTHH:mm")}
                        onChange={(e) =>
                            handleInputChange(
                                "date",
                                dayjs
                                    .tz(e.target.value, manilaTimeZone)
                                    .toISOString()
                            )
                        }
                        slotProps={{
                            input: {
                              readOnly: true,
                            },
                          }}
                        fullWidth
                        size="small"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ mb: 2 }}
                    />
                </Box>
            </Paper>

            {/* Tabs for Registrants */}
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={tabIndex}
                    onChange={(_, newIndex) => setTabIndex(newIndex)}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Registrants" />
                    <Tab label="Attendees" />
                </Tabs>
                {registrants.length > 0 ? (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Position</TableCell>
                                <TableCell>Attended</TableCell>
                                {tabIndex === 1 && <TableCell>Date</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRegistrants.map((registrant, index) => (
                                <TableRow key={registrant.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{registrant.name}</TableCell>
                                    <TableCell>{registrant.email}</TableCell>
                                    <TableCell>{registrant.company}</TableCell>
                                    <TableCell>{registrant.position}</TableCell>
                                    <TableCell>
                                        {registrant.is_attended ? "Yes" : "No"}
                                    </TableCell>
                                    {tabIndex === 1 && (
                                        <TableCell>
                                            {dayjs(registrant.updated_at)
                                                .tz(manilaTimeZone)
                                                .format("MM-DD-YYYY h:mm A")}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography sx={{ textAlign: "center", mt: 3, p: 3 }}>
                        No registrants yet for this event.
                    </Typography>
                )}
            </Paper>
            

            {/* Save and Cancel Buttons */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    mt: 3,
                }}
            >
                {/* <Button variant="contained" color="primary" onClick={handleUpdate}>
                    Save Changes
                </Button> */}
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate("/events")}
                >
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};

export default EventDetails;
