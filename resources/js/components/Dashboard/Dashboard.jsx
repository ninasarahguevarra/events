import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    Grid2,
    List,
    ListItem,
    ListItemText,
    Button,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import GroupIcon from "@mui/icons-material/Group";
import Chart from "react-apexcharts";
import WcIcon from '@mui/icons-material/Wc';
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { apiClient, getAuth } from "../../utils/authUtils";

const Dashboard = () => {
    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [count, setCount] = useState(null);
    const [topCompanies, setTopCompanies] = useState([]);
    const [genderData, setGenderData] = useState(null);
    const navigate = useNavigate();
    dayjs.extend(utc);
    dayjs.extend(timezone);

    useEffect(() => {
        if (!getAuth()) {
            navigate("/");
        }

        const fetchEventDetails = async () => {
            try {
                const response = await apiClient.get(
                    `/api/events/current-event`
                );
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

        const fetchTopCompanies = async () => {
            try {
                const response = await apiClient.get(
                    `/api/events/show-top-companies`
                );
                console.log(response);

                setTopCompanies(response.data.data);
            } catch (error) {
                console.error("Error fetching top companies:", error);
            }
        };

        const fetchGenderData = async () => {
            try {
                const response = await apiClient.get('/api/registrants/by-gender');
                setGenderData(response.data.data);
            } catch (error) {
                console.error("Error fetching gender data:", error);
            }
        };

        fetchEventDetails();
        fetchTopCompanies();
        fetchGenderData();
    }, []);

    const topCompaniesChartOptions = {
        chart: {
            type: "bar",
            height: 350,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "50%",
                endingShape: "rounded",
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: topCompanies.map((company) => company.company),
        },
        colors: ["#1E88E5"],
    };

    const topCompaniesChartSeries = [
        {
            name: "Attendees",
            data: topCompanies.map((company) => company.attendee_count),
        },
    ];

    const genderChartOptions = {
        chart: {
            type: 'pie',
            height: 350,
        },
        labels: genderData ? Object.keys(genderData) : [],
        colors: ['#FF4560', '#1E88E5'], // Custom colors for Male/Female
    };
    
    const genderChartSeries = genderData
        ? Object.values(genderData)
        : [];


    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Dashboard
            </Typography>
            {event ? (
                <>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        <EventIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        {event.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Location: {event.location} | Date:{" "}
                        {new Date(event.date).toLocaleDateString()}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mb: 2 }}
                    >
                        Total Attendees: {attendees.length} out of {count}{" "}
                        registrants
                    </Typography>
                    <Divider sx={{ my: 3 }} />

                    <Grid2 container spacing={3}>
                        <Grid2 item size={{ xs: 12, md: 6 }}>
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        <GroupIcon
                                            sx={{
                                                verticalAlign: "middle",
                                                mr: 1,
                                            }}
                                        />
                                        Top Attendees: Early Arrivals
                                    </Typography>

                                    {attendees.length > 0 ? (
                                        <List>
                                            {attendees
                                                .slice(0, 5)
                                                .map((attendee) => (
                                                    <ListItem key={attendee.id}>
                                                        <ListItemText
                                                            primary={
                                                                attendee.name
                                                            }
                                                            secondary={[
                                                                attendee.company
                                                                    ? `${attendee.company}, `
                                                                    : "",
                                                                dayjs(
                                                                    attendee.updated_at
                                                                )
                                                                    .tz(
                                                                        "Asia/Manila"
                                                                    )
                                                                    .format(
                                                                        "MM-DD-YYYY h:mm A"
                                                                    ),
                                                            ]}
                                                        />
                                                    </ListItem>
                                                ))}
                                        </List>
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            No attendees yet.
                                        </Typography>
                                    )}
                                    {attendees.length > 5 && (
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{ mt: 1 }}
                                        >
                                            Showing 5 of {attendees.length}{" "}
                                            attendees.
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
                        </Grid2>

                        <Grid2 item size={{ xs: 12, md: 6 }}>
                            {topCompanies.length > 0 ? (
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 2 }}>
                                            <CorporateFareIcon
                                                sx={{
                                                    verticalAlign: "middle",
                                                    mr: 1,
                                                }}
                                            />
                                            Top Companies by Attendee Count
                                        </Typography>
                                        <Chart
                                            options={topCompaniesChartOptions}
                                            series={topCompaniesChartSeries}
                                            type="bar"
                                            height={350}
                                        />
                                    </CardContent>
                                </Card>
                            ) : (
                                <Typography
                                    variant="body1"
                                    color="textSecondary"
                                >
                                    Loading top companies data...
                                </Typography>
                            )}

                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        <WcIcon
                                            sx={{
                                                verticalAlign: "middle",
                                                mr: 1,
                                            }}
                                        />
                                        Registrant Gender Distribution
                                    </Typography>
                                    {genderData ? (
                                        <Chart
                                            options={genderChartOptions}
                                            series={genderChartSeries}
                                            type="pie"
                                            height={350}
                                        />
                                    ) : (
                                        <Typography
                                            variant="body1"
                                            color="textSecondary"
                                        >
                                            Loading gender data...
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid2>
                    </Grid2>
                </>
            ) : (
                <Typography variant="body1" color="textSecondary">
                    Loading event details...
                </Typography>
            )}
        </Box>
    );
};

export default Dashboard;
