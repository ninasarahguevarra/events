import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../utils/authUtils";
import {
    Box,
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
    TablePagination,
    Fab,
    Tooltip,
    CircularProgress,
    Modal
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { saveAs } from "file-saver";
import Papa from "papaparse";

const EventsRegistrants = ({uploaded, modalStyle}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [registrants, setRegistrants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);
    const [isDownloadingList, setIsDownloadingList] = useState(false);
    const [isDownloadingIDs, setIsDownloadingIDs] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Pagination states
    const [page, setPage] = useState(0); // Current page (0-based index)
    const [rowsPerPage, setRowsPerPage] = useState(50); // Default 50 per page
    const [printIdLabel, setPrintIdLabel] = useState('1 - 50'); // Default 50 per page
    const [totalRegistrants, setTotalRegistrants] = useState(0); // Total count from API

    dayjs.extend(utc);
    dayjs.extend(timezone);
    const manilaTimeZone = "Asia/Manila";

    useEffect(() => {
        const label = ((page * rowsPerPage) + 1) + ' - ' + ((page + 1) * rowsPerPage);
        setPrintIdLabel(label);
        const fetchRegistrants = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get(`/api/registrants?event_id=${id}&page=${page + 1}&per_page=${rowsPerPage}`);
                
                const { data, total } = response.data.registrants;
                setRegistrants(data);
                setTotalRegistrants(total);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };

        fetchRegistrants();
    }, [id, page, rowsPerPage, uploaded]);

    const printID = async () => {
        setIsDownloadingIDs(true);
        const response = await apiClient.get(`/api/events/generate-images?event_id=${id}&page=${page + 1}`);
        console.log(response);
        
        if (response.status == 200) {
            window.location.href = response.data.zip_url;
        } else {
            setShowModal(true)
        }
        setIsDownloadingIDs(false);
    };

    const handleDownloadCSV = async () => {
        try {
            setIsDownloadingList(true);
            const response = await apiClient.get(`/api/registrants?event_id=${id}&per_page=2042`);
            const { data } = response.data.registrants;
    
            if (!data || data.length === 0) {
                console.warn("No registrants found.");
                return;
            }
    
            // Convert data to CSV format
            const csv = Papa.unparse(data, {
                columns: ["id", "name", "email", "affiliation", "printed", "is_attended"],
            });
    
            // Convert CSV string to a Blob
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    
            // Trigger download
            saveAs(blob, "registrants_list.csv");
            setIsDownloadingList(false);
    
        } catch (error) {
            console.error("Download failed:", error);
            setIsDownloadingList(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page
    };

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const filteredRegistrants =
        tabIndex === 1 ? registrants.filter((r) => r.is_attended) : registrants;

    const total =
        tabIndex === 1 ? filteredRegistrants.length : totalRegistrants;

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <>
            <Paper sx={{ mb: 3, p: 4 }}>
                <Box sx={{ position: "relative" }}>
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
                    <Box sx={{
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        right: 0,
                        top: 0,
                    }}
                >
                    {
                        tabIndex === 0 && <>
                            <Button variant="outlined" color="secondary" sx={{minWidth: '148px', height: '36.5px'}} onClick={handleDownloadCSV}>
                                {isDownloadingList ? <CircularProgress size={20} /> : "Download list"}
                            </Button>
                            <Button variant="contained" color="primary" sx={{minWidth: '190px', height: '36.5px'}} onClick={printID}>
                                {isDownloadingIDs ? <CircularProgress size={20} color="inherit" /> : `Download IDs (${printIdLabel})`}
                            </Button>
                        </>
                    }
                </Box>
                </Box>

                {registrants.length > 0 ? (
                    <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Organization</TableCell>
                                    <TableCell>Attended</TableCell>
                                    {tabIndex === 1 && <TableCell>Date</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRegistrants.map((registrant, index) => (
                                    <TableRow key={registrant.id}>
                                        <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                                        <TableCell>{registrant.name}</TableCell>
                                        <TableCell>{registrant.email}</TableCell>
                                        <TableCell>{registrant.affiliation}</TableCell>
                                        <TableCell>{registrant.is_attended ? "Yes" : "No"}</TableCell>
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

                        {/* Pagination */}
                        <TablePagination
                            component="div"
                            count={total}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[50]}
                        />
                    </>
                ) : (
                    <Typography sx={{ textAlign: "center", mt: 3, p: 3 }}>
                        No registrants yet for this event.
                    </Typography>
                )}
            </Paper>

            <Box sx={{ display: "flex", justifyContent: "end", gap: 2, mt: 3 }}>
                <Tooltip title="Scroll to Top">
                    <Fab color="primary" onClick={handleScrollToTop} size="medium">
                        <KeyboardArrowUpIcon />
                    </Fab>
                </Tooltip>
            </Box>

            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                aria-labelledby="success-modal-title"
                aria-describedby="success-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography
                        id="success-modal-title"
                        variant="h6"
                        sx={{ mb: 2 }}
                        color="error.main"
                    >
                        Error in downloading zip file
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setShowModal(false)}
                        sx={{ mt: 3 }}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default EventsRegistrants;