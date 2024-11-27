import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemText,
    Button,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { apiClient, getAuth } from "../../utils/authUtils";

const Dashboard = () => {
    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const navigate = useNavigate();
    dayjs.extend(utc);
    dayjs.extend(timezone);

    useEffect(() => {

        if (!getAuth()) {
            navigate("/");
        }

        const fetchEventDetails = async () => {
            try {
                const response = await apiClient.get(`/api/events/current-event`);
                const eventData = response.data.data.event;
                const attendees = response.data.data.attendees;

                setEvent(eventData);
                setAttendees(attendees);
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };

        fetchEventDetails();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Dashboard
            </Typography>

            {event ? (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            <EventIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                            {event.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Location: {event.location} | Date:{" "}
                            {new Date(event.date).toLocaleDateString()}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Top Attendees:
                        </Typography>
                        {/* Check if there are attendees */}
                        {attendees.length > 0 ? (
                            <List>
                                {attendees.slice(0, 10).map((attendee) => (
                                    <ListItem key={attendee.id}>
                                        <ListItemText
                                            primary={attendee.name}
                                            secondary={[
                                                attendee.email,
                                                ", ",
                                                dayjs(attendee.updated_at)
                                                    .tz("Asia/Manila")
                                                    .format("MM-DD-YYYY h:mm A"),
                                            ]}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                No attendees yet.
                            </Typography>
                        )}
                        {attendees.length > 10 && (
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ mt: 1 }}
                            >
                                Showing 10 of {attendees.length} attendees.
                            </Typography>
                        )}
                        <Button
                            variant="outlined"
                            sx={{ mt: 2 }}
                            onClick={() => navigate("/events")}
                        >
                            See More Details
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Typography variant="body1" color="textSecondary">
                    Loading event details...
                </Typography>
            )}
        </Box>
    );
};

export default Dashboard;
