import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../utils/authUtils";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Toolbar,
    Modal,
    Grid2,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { styled } from '@mui/material/styles';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import IdLayout from './IdLayout';
import EventsRegistrants from './EventsRegistrants';

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
    const [uploaded, setUploaded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({ name: false, date: false });
    const [openDrawer, setOpenDrawer] = useState(false);
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const manilaTimeZone = "Asia/Manila";
    const fileInputRef = useRef(null); 

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await apiClient.get(`/api/events/show/${id}`);
                const { data } = response.data;
                setEventData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };

        fetchEventDetails();
    }, [id, uploaded]);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

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

        setErrors((prevErrors) => (
            {
                ...prevErrors,
                [field]: !value,
            }
        ));
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
    
    const validate = () => {
        const newErrors = {
            name: !eventData.name.trim(),
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };


    const handleUpdate = async () => {
        if (validate()) {
            try {
                const response = await apiClient.post(`/api/events/update/${id}`, eventData);
                if (response.data.success) {
                    navigate("/events");
                }
            } catch (error) {
                console.error("Error updating event:", error);
            }
        }
    };

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
                <TextField
                    label="Event Name"
                    value={eventData.name}
                    onChange={(e) =>
                        handleInputChange("name", e.target.value)
                    }
                    fullWidth
                    size="small"
                    sx={{ mb: 2 }}
                    error={errors.name}
                    helperText={errors.name ? "Name is required." : ""}
                />
                <TextField
                    label="Location"
                    value={eventData.location}
                    onChange={(e) =>
                        handleInputChange("location", e.target.value)
                    }
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
                        size="small"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ mb: 2, width: '50%' }}
                    />
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
                        size="small"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ mb: 2, width: '50%' }}
                    />
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "end",
                        gap: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate("/events")}
                    >
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Box>
            </Paper>

            <Typography variant="h4" gutterBottom>
                Registration Details
            </Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid2 container spacing={2} rowSpacing={2}>
                    <Grid2 item size={{ xs: 6, md: 8 }}>
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
                        />
                    </Grid2>

                    <Grid2 item size={{ xs: 6, md: 4 }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
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
                    </Grid2>

                    <Grid2 item size={{ xs: 4, md: 4 }}>
                        <Button
                            component="label"
                            fullWidth
                            variant="outlined"
                            color="primary"
                            sx={{ mr: 2 }}
                            startIcon={<FileDownloadIcon />}
                            onClick={handleDownload} // Attach the function
                        >
                            Download CSV Format
                        </Button>
                    </Grid2>

                    <Grid2 item size={{ xs: 4, md: 4 }}>
                        <Button
                            loading
                            fullWidth
                            loadingPosition="end"
                            variant="outlined"
                            color="primary"
                            onClick={handleButtonClick}
                            tabIndex={-1}
                            startIcon={<FileUploadIcon />}
                        >
                            Upload Csv
                            <VisuallyHiddenInput
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileChange}
                                multiple
                            />
                        </Button>
                    </Grid2>

                    <Grid2 item size={{ xs: 4, md: 4 }}>
                        <Button
                            loading
                            fullWidth
                            component="label"
                            variant="outlined"
                            color="primary"
                            onClick={() => setOpenDrawer(true)}
                        >
                            ID Layout
                        </Button>
                    </Grid2>
                </Grid2>
            </Paper>

            {/* Tabs for Registrants */}
            <EventsRegistrants uploaded={uploaded} modalStyle={modalStyle} />

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
                        color={uploaded ? "success.main" : "error.main"}
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

            <IdLayout openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}  />
        </Box>
    );
};

export default EventDetails;
