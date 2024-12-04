import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../utils/authUtils";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Typography,
    IconButton,
} from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const EventList = () => {
    const [events, setEvents] = useState([]); // Stores all events from the API
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const navigate = useNavigate(); // Initialize useNavigate

    dayjs.extend(utc);
    dayjs.extend(timezone);

    // Fetch events from the API
    const fetchEvents = async () => {
        try {

            const response = await apiClient.get(
                `/api/events?page=${page + 1}&per_page=${rowsPerPage}`
            );

            const { data } = response.data;
            setEvents(data.data);
            setTotalRows(data.total);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page
    };

    const handleEditClick = (eventId) => {
        navigate(`/events/${eventId}`);
    };

    useEffect(() => {
        fetchEvents();
    }, [page, rowsPerPage]); // Refetch data when page or rows per page changes

    return events.length > 0 ? (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Location</TableCell>
                            {/* <TableCell>Status</TableCell> */}
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell>{event.name}</TableCell>
                                <TableCell>{event.description}</TableCell>
                                <TableCell>{dayjs(event.date).tz('Asia/Manila').format('MM-DD-YYYY h:mm A')}</TableCell>
                                <TableCell>{event.location}</TableCell>
                                {/* <TableCell>{event.status}</TableCell> */}
                                <TableCell>
                                    <IconButton
                                        aria-label="edit"
                                        onClick={() => handleEditClick(event.id)}
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={totalRows}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
        </Paper>
    ) : (
        <Typography variant="body1">No events created yet.</Typography>
    );
};

export default EventList;
