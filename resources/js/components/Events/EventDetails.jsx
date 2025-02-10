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
    Toolbar,
    Input,
    Modal
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

  // Modal style
const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: 400,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    textAlign: "center",
};

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [eventData, setEventData] = useState(null);
    const [registrants, setRegistrants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);
    const [uploaded, setUploaded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    dayjs.extend(utc);
    dayjs.extend(timezone);

    const manilaTimeZone = "Asia/Manila";

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await apiClient.get(`/api/events/show/${id}`);
                const { event, registrant } = response.data.data;
                setEventData(event);

                setRegistrants(registrant);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };

        fetchEventDetails();
    }, [id, uploaded]);


    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            handleUpload(selectedFile); // Pass the file to handleUpload
        }
    };

    const handleInputChange = (field, value) => {
        setEventData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleUpload = async (file) => {
        if (!file) {
            alert("Please select a file.");
            return;
        }
    
        const formData = new FormData();
        formData.append("csv_file", file);
    
        try {
            const response = await apiClient.post(`/api/registrants/upload/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUploaded(response.data.success ?? false);
            setShowModal(true);
        } catch (error) {
            console.error("Upload failed:", error);
            setShowModal(false);
            setUploaded(false);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await apiClient.get("/api/events/download-csv", {
                responseType: "blob",
            });
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "sample_template.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };
    

    const handleUpdate = async () => {
        try {
            const response = await apiClient.post(`/api/events/update/${id}`, {
                ...eventData,
                registrants,
            });
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
        <Box>
            <Toolbar
                sx={{
                    display: { sm: "none" },
                }}
            />
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
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: 'baseline',
                            columnGap: 2,
                        }}
                    >
                        <TextField
                            label={eventData.end_date ? "Start Date" : "Date"}
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
                            size="small"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ mb: 2, width: '50%' }}
                        />
                        { eventData.end_date &&
                            <TextField
                                label="End Date"
                                type="datetime-local"
                                value={dayjs(eventData.end_date)
                                    .tz(manilaTimeZone)
                                    .format("YYYY-MM-DDTHH:mm")}
                                onChange={(e) =>
                                    handleInputChange(
                                        "end_date",
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
                                size="small"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{ mb: 2, width: '50%' }}
                            />
                        }
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            // justifyContent: "flex-start",
                            alignItems: 'baseline',
                            columnGap: 2,
                        }}
                    >
                        <TextField
                            label="Registration Link"
                            value={`${import.meta.env.VITE_API_URL}/register/${
                                eventData.id
                            }`}
                            slotProps={{
                                input: {
                                    fullWidth: false,
                                    readOnly: true,
                                    endAdornment: (
                                        <Button
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    `${
                                                        import.meta.env.VITE_API_URL
                                                    }/register/${eventData.id}`
                                                );
                                                alert("Link copied to clipboard");
                                            }}
                                            size="small"
                                        >
                                            Copy
                                        </Button>
                                    ),
                                },
                            }}
                            fullWidth
                            size="small"
                            sx={{ mb: 2, width: '50%', flexGrow: 1  }}
                        />
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() =>
                                window.open(
                                    `${import.meta.env.VITE_API_URL}/register/${
                                        eventData.id
                                    }`,
                                    "_blank"
                                )
                            }
                        >
                            Go to Registration Link
                        </Button>
                    </Box>
                    <Box>
                        <Button
                            component="label"
                            variant="outlined"
                            color="secondary"
                            sx={{ mr: 2 }}
                            startIcon={<CloudDownloadIcon />}
                            onClick={handleDownload} // Attach the function
                        >
                            Download CSV Format
                        </Button>

                        <Button
                            loading
                            loadingPosition="end"
                            component="label"
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload Csv
                            <VisuallyHiddenInput
                                type="file"
                                onChange={handleFileChange}
                                multiple
                            />
                        </Button>
                    </Box>
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

            {/* Success Modal */}
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
                        color="success.main"
                    >
                        {uploaded ? 'Bulk Registration Successful!' : 'Failed to bulk register'}
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
        </Box>
    );
};

export default EventDetails;
