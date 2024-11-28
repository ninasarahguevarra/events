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
    Grid2,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { apiClient, getAuth } from "../../utils/authUtils";

const Dashboard = () => {
    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [count, setCount] = useState(null);
    const [topCompany, setTopCompany] = useState(null);
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
                const total_registrant = response.data.data.total_registrant;

                setEvent(eventData);
                setCount(total_registrant);
                setAttendees(attendees);
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };

        const fetchTopCompany = async () => {
            try {
                const response = await apiClient.get(`/api/events/show-top-company`);
                setTopCompany(response.data.data);
            } catch (error) {
                console.error("Error fetching top company details:", error);
            }
        };

        fetchEventDetails();
        fetchTopCompany();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Dashboard
            </Typography>
            <Grid2 container spacing={3}>
                <Grid2 item size={{ xs: 12, md: 6 }}>
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
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    Total Attendees: {attendees.length} out of {count} registrants
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                    Top Attendees:
                                </Typography>

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
                                {attendees.length > 5 && (
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ mt: 1 }}
                                    >
                                        Showing 5 of {attendees.length} attendees.
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
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    {topCompany ? (
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    <CorporateFareIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                                    Top Company
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Company Name: {topCompany.company}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    Total Attendees: {topCompany.attendee_count}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                    Attendees:
                                </Typography>
                                <List>
                                    {topCompany.registrants.map((registrant, index) => (
                                        <ListItem key={index}>
                                            <ListItemText
                                                primary={registrant.name}
                                                secondary={registrant.email}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    ) : (
                        <Typography variant="body1" color="textSecondary">
                            Loading top company details...
                        </Typography>
                    )}
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default Dashboard;
