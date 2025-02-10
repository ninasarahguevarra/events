import React, { useEffect, useState } from "react";
import {
    Button,
    TextField,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Grid2,
    Radio,
    RadioGroup,
    FormLabel,
    FormHelperText,
    Card,
    CardMedia,
    CircularProgress,
    Modal
} from "@mui/material";

import EventIcon from "@mui/icons-material/Event";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../utils/authUtils";

import bagImage from "../../assets/bag.jpg";
import cardImage from "../../assets/card.jpg";
import shirtImage from "../../assets/shirt.jpg";

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

const Register = () => {
    const { id } = useParams();
    // const navigate = useNavigate();
    const [formData, setFormData] = useState({'event_id': id});
    const [loading, setLoading] = useState(true);
    const [eventData, setEventData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);

    // useEffect(() => {
    //     // Example auth check logic
    //     if (false) {
    //         // Replace "false" with your auth check logic (e.g., getAuth())
    //         navigate("/dashboard");
    //     }
    // }, []);

    useEffect(() => {
        
        const fetchEventDetails = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get(
                    `/api/events/show/${id}`
                );
                const { event } = response.data.data;
                setEventData(event);
            } catch (error) {
                console.error("Error fetching event details:", error);
                setEventData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const resetForm = () => {
        setFormData({ event_id: id });
        setErrors({});
    };

    const validate = () => {
        const newErrors = {
            first_name: !formData.first_name,
            last_name: !formData.last_name,
            gender: !formData.gender,
            email: !formData.email,
            province: !formData.province,
            municipality: !formData.municipality,
            affiliation: !formData.affiliation,
            position: !formData.position,
            sector: !formData.sector,
            social_classification: !formData.social_classification,
            attendance_qualification: !formData.attendance_qualification,
            industry: !formData.industry,
            ict_council: !formData.ict_council,
            registration_type_id: !formData.registration_type_id,
            shirt_size: !formData.shirt_size,
            social_media: !formData.social_media,
            website: !formData.website,
            is_agree_privacy: !formData.is_agree_privacy,
        };

        if (formData.ict_council === 'Other') {
            newErrors.other_industry = !formData.other_industry;
        }
        if (formData.ict_council === 'yes') {
            newErrors.ict_council_name = !formData.ict_council_name;
            newErrors.is_ict_member = !formData.is_ict_member;
        }
        if (!formData.contact_number) {
            newErrors.contact_number = "Mobile number is required.";
        } else if (!/^\d{10,12}$/.test(formData.contact_number)) {
            newErrors.contact_number = "Please enter a valid mobile number (10-12 digits).";
        }
        console.log("newErrors:", newErrors);

        setErrors(newErrors);

        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate and submit the form
        
        if (validate()) {
            setIsSaving(true);
            try {
                await apiClient.post(`/api/registrants/save`, formData);
                resetForm();
                window.scrollTo({ top: 0, behavior: "smooth" });
                setShowModal(true);
            } catch (error) {
                console.error("Error in registration:", formData);
            } finally {
                setIsSaving(false);
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                bgcolor: "#ffffff",
                px: {xs: 4, sm: 4, md: 16}
            }}
        >
            <Typography variant="h5" sx={{ mb: 3}}>
                Event Registration Form
            </Typography>
            {eventData ? (
                <Card variant="outlined" sx={{ p: 3, mb: 3, width: "100%" }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        <EventIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        Event Details
                    </Typography>
                    <Typography variant="body1">
                        <strong>Name:</strong> {eventData.name}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Description:</strong> {eventData.description}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Location:</strong> {eventData.location}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Date:</strong> {`${new Date(eventData.date).toLocaleDateString()}${eventData.end_date ? ' - ' + new Date(eventData.end_date).toLocaleDateString() : ''}`}
                    </Typography>
                </Card>
            ) : (
                <Typography variant="body1" color="textSecondary">
                    Loading event details...
                </Typography>
            )}

            <form onSubmit={handleSubmit}>
                {/* Basic Info */}
                <Card variant="outlined" sx={{p:2, mb:2, width:'100%' }}>
                    <Grid2 container spacing={2} rowSpacing={2}>
                        <Grid2 item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="First Name"
                                variant="outlined"
                                error={errors.first_name}
                                helperText={errors.first_name ? "First name is required." : ""}
                                value={formData.first_name || ""}
                                onChange={(e) =>
                                    handleChange("first_name", e.target.value)
                                }
                            />
                        </Grid2>
                        <Grid2 item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                variant="outlined"
                                error={errors.last_name}
                                helperText={errors.last_name ? "Last name is required." : ""}
                                value={formData.last_name || ""}
                                onChange={(e) =>
                                    handleChange("last_name", e.target.value)
                                }
                            />
                        </Grid2>
                        <Grid2 item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Preferred Name"
                                variant="outlined"
                                value={formData.preferred_name || ""}
                                onChange={(e) =>
                                    handleChange("preferred_name", e.target.value)
                                }
                            />
                        </Grid2>
                         <Grid2 item size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth error={errors.gender}>
                                <InputLabel id="gender-label">Gender</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    label="Gender"
                                    value={formData.gender || ""}
                                    onChange={(e) =>
                                        handleChange("gender", e.target.value)
                                    }
                                >
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Prefer not to say">
                                        Prefer not to say
                                    </MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                                {errors.gender && (
                                    <FormHelperText>
                                        {errors.gender ? "Gender is required" : ""}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid2>
                        <Grid2 item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Email"
                                variant="outlined"
                                error={errors.email}
                                value={formData.email || ""}
                                helperText={errors.email ? "Email is required." : ""}
                                onChange={(e) =>
                                    handleChange("email", e.target.value)
                                }
                            />
                        </Grid2>
                        <Grid2 item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Mobile Number"
                                variant="outlined"
                                error={errors.contact_number}
                                helperText={errors.contact_number}
                                value={formData.contact_number || ""}
                                onChange={(e) =>
                                    handleChange("contact_number", e.target.value)
                                }
                            />
                        </Grid2>
                        <Grid2 item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Province"
                                variant="outlined"
                                error={errors.province}
                                helperText={errors.province ? "Province is required." : ""}
                                value={formData.province || ""}
                                onChange={(e) =>
                                    handleChange("province", e.target.value)
                                }
                            />
                        </Grid2>
                        <Grid2 item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="City/Municipality of Residence"
                                variant="outlined"
                                error={errors.municipality}
                                helperText={errors.municipality ? "City/municipality is required." : ""}
                                value={formData.municipality || ""}
                                onChange={(e) =>
                                    handleChange("municipality", e.target.value)
                                }
                            />
                        </Grid2>

                        {/* Work Info */}
                        <Grid2 item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Organization/Office/Affiliation"
                                variant="outlined"
                                error={errors.affiliation}
                                helperText={errors.affiliation ? "Organization/office/affiliation is required." : ""}
                                value={formData.affiliation || ""}
                                onChange={(e) =>
                                    handleChange("affiliation", e.target.value)
                                }
                            />
                        </Grid2>
                        <Grid2 item size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Position/Designation"
                                variant="outlined"
                                error={errors.position}
                                helperText={errors.position ? "Position is required." : ""}
                                value={formData.position || ""}
                                onChange={(e) =>
                                    handleChange("position", e.target.value)
                                }
                            />
                        </Grid2>
                        <Grid2 item size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth error={errors.sector}>
                                <InputLabel id="sector-label">Sector</InputLabel>
                                <Select
                                    labelId="sector-label"
                                    id="sector"
                                    label="Sector"
                                    value={formData.sector || ""}
                                    onChange={(e) =>
                                        handleChange("sector", e.target.value)
                                    }
                                >
                                    <MenuItem value="Academe/Training">
                                        Academe/Training
                                    </MenuItem>
                                    <MenuItem value="Private/Business/MSME">
                                        Private/Business/MSME
                                    </MenuItem>
                                    <MenuItem value="Public/Government">
                                        Public/Government
                                    </MenuItem>
                                </Select>
                                {errors.sector && (
                                    <FormHelperText>
                                        {errors.sector ? "Sector is required" : ""}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid2>
                        <Grid2 item size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth error={errors.social_classification}>
                                <InputLabel id="social-classification-label">
                                    Social Classification
                                </InputLabel>
                                <Select
                                    labelId="social-classification-label"
                                    label="Social Classification"
                                    id="social-classification"
                                    value={formData.social_classification || ""}
                                    onChange={(e) =>
                                        handleChange(
                                            "social_classification",
                                            e.target.value
                                        )
                                    }
                                >
                                    <MenuItem value="Abled">Abled</MenuItem>
                                    <MenuItem value="Differently Abled">
                                        Differently Abled
                                    </MenuItem>
                                    <MenuItem value="Indigenous Person">
                                        Indigenous Person
                                    </MenuItem>
                                    <MenuItem value="Senior Citizen">
                                        Senior Citizen
                                    </MenuItem>
                                    <MenuItem value="Youth">Youth</MenuItem>
                                    <MenuItem value="Out-of-School Youth">
                                        Out-of-School Youth
                                    </MenuItem>
                                </Select>
                                {errors.social_classification && (
                                    <FormHelperText>
                                        {errors.social_classification ? "Social classification is required" : ""}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid2>
                        <Grid2 item size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth error={errors.industry}>
                                <InputLabel id="industry-label">Industry</InputLabel>
                                <Select
                                    labelId="industry-label"
                                    id="industry"
                                    label="Industry"
                                    value={formData.industry || ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === 'Other') {
                                            formData.other_industry = '';
                                        }
                                        handleChange("industry", e.target.value)
                                    }}
                                >
                                    <MenuItem value="IT-BPM">IT-BPM</MenuItem>
                                    <MenuItem value="BPO">BPO</MenuItem>
                                    <MenuItem value="Tech Company">Tech Company</MenuItem>
                                    <MenuItem value="Education">Education</MenuItem>
                                    <MenuItem value="Finance">Finance</MenuItem>
                                    <MenuItem value="Retail">Retail</MenuItem>
                                    <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                                    <MenuItem value="Healthcare">Healthcare</MenuItem>
                                    <MenuItem value="Services">Services</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                                {errors.industry && (
                                    <FormHelperText>
                                        {errors.industry ? "Industry classification is required" : ""}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            {formData.industry === "Other" && (
                                <TextField
                                    fullWidth
                                    label="Specify Other Industry"
                                    variant="outlined"
                                    value={formData.other_industry || ""}
                                    onChange={(e) =>
                                        handleChange("other_industry", e.target.value)
                                    }
                                    sx={{ mt: 2 }}
                                    error={!!errors.other_industry}
                                    helperText={errors.other_industry ? "Industry name is required." : ""}
                                />
                            )}
                        </Grid2>

                        {/* ICT Info */}
                        <Grid2 item size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth error={errors.ict_council}>
                                <InputLabel id="ict-council-label">ICT Council</InputLabel>
                                <Select
                                    labelId="ict-council-label"
                                    id="ict-council"
                                    label="ICT Council"
                                    value={formData.ict_council || ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === 'yes') {
                                            formData.ict_council_name = '';
                                            formData.is_ict_member = '';
                                        }
                                        handleChange("ict_council", e.target.value);
                                    }}
                                >
                                    <MenuItem value="yes">We have one</MenuItem>
                                    <MenuItem value="interested">None, but we are interested</MenuItem>
                                    <MenuItem value="n/a">N/A</MenuItem>
                                </Select>
                                {errors.ict_council && (
                                    <FormHelperText>
                                        {errors.ict_council ? "ICT council is required" : ""}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            {formData.ict_council === "yes" && (
                                <>
                                    <Grid2 item size={{ xs: 12}}>
                                        <TextField
                                            fullWidth
                                            label="ICT Council Name"
                                            variant="outlined"
                                            error={errors.ict_council_name}
                                            helperText={errors.ict_council_name ? "ICT council name is required." : ""}
                                            value={formData.ict_council_name || ""}
                                            onChange={(e) =>
                                                handleChange("ict_council_name", e.target.value)
                                            }
                                            sx={{ my: 2}}
                                        />
                                    </Grid2>

                                    <Grid2 item size={{ xs: 12}}>
                                        <FormControl fullWidth>
                                            <FormLabel id="is-ict-member-label">Is your ICT Council a member of the National ICT Confederation of the Philippines? 
                                            </FormLabel>
                                            <RadioGroup
                                                row
                                                aria-labelledby="is-ict-member-label"
                                                name="is-ict-member-radio-buttons-group"
                                                value={formData.is_ict_member || ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    handleChange('is_ict_member', value);
                                                }}
                                            >
                                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="no" control={<Radio />} label="No" />
                                                <FormControlLabel value="n/a" control={<Radio />} label="N/A" />
                                            </RadioGroup>
                                            {errors.is_ict_member && (
                                                <Typography color="error" variant="caption" sx={{px:1.5}}>
                                                    {errors.is_ict_member ? "Field is required" : ""}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Grid2>
                                </>
                            )}
                        </Grid2>

                        {/* Attendance Info */}
                        <Grid2 item size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth error={errors.attendance_qualification}>
                                <InputLabel id="attendance-qualification-label">Attendance Qualification</InputLabel>
                                <Select
                                    labelId="attendance-qualification-label"
                                    id="attendance-qualification"
                                    label="Attendance Qualification"
                                    value={formData.attendance_qualification || ""}
                                    onChange={(e) =>
                                        handleChange("attendance_qualification", e.target.value)
                                    }
                                >
                                    <MenuItem value="Delegate/Participant">Delegate/Participant</MenuItem>
                                    <MenuItem value="Event Partner">Event Partner</MenuItem>
                                    <MenuItem value="Speaker">Speaker</MenuItem>
                                    <MenuItem value="Moderator">Moderator</MenuItem>
                                    <MenuItem value="Event">Event Supplier</MenuItem>
                                    <MenuItem value="Guest">Guest</MenuItem>
                                    <MenuItem value="Organizer/Secretariat">Organizer/Secretariat</MenuItem>
                                </Select>
                                {errors.attendance_qualification && (
                                    <FormHelperText>
                                        {errors.attendance_qualification ? "Attendance qualification is required" : ""}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid2>
                        <Grid2 item size={{ xs: 12, md: 6 }}></Grid2>
                    </Grid2>
                </Card>

                {/* Event Merch Info */}
                <Card variant="outlined" sx={{p:2, mb: 2, width:'100%' }}>
                    <Grid2 
                        container
                        spacing={2}
                        rowSpacing={2}
                        sx={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        {/* Merch options */}
                        <Grid2 item size={{ xs: 12, md:6}}>
                            <FormControl fullWidth>
                                <FormLabel id="registration-type-label">Please choose your registration type: Meals throughout the event include an AM snack, lunch, and PM snack.
                                </FormLabel>
                                <RadioGroup
                                    // row
                                    aria-labelledby="registration-type-label"
                                    name="registration-type-radio-buttons-group"
                                    value={formData.registration_type_id || ""}
                                    onChange={(e) => handleChange('registration_type_id', e.target.value)}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Registration fee with 2 days of meals - ₱3,500.00" />
                                    <FormControlLabel value="2" control={<Radio />} label="Registration fee with 2 days of meals and an event kit - ₱5,000.00 (The event kit includes a tote bag, T-shirt and NICP Contact Card (RFID Card for NICP Events)." />
                                    <FormControlLabel value="3" control={<Radio />} label="Not applicable – For speakers, moderators, and guests only, or an NICP member. Note: Only one representative from each ICT council is free. Any additional participants (delegates) must pay the registration fee." />
                                </RadioGroup>
                                {errors.registration_type_id && (
                                    <Typography color="error" variant="caption" sx={{px:1.5}}>
                                        {errors.registration_type_id ? "Registration type is required" : ""}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid2>
                        <Grid2 item size={{ xs: 12, md:6}}>
                            <>
                                <FormHelperText id="shirt-size-label2" sx={{mb:2, fontSize:"16px"}}>
                                    Please indicate your shirt size so we can prepare it in advance (for delegates opting to avail of event kit only). 
                                </FormHelperText>
                                <FormControl fullWidth error={errors.shirt_size}>
                                    <InputLabel id="shirt-size-label">Shirt Size</InputLabel>
                                    <Select
                                        labelId="shirt-size-label"
                                        id="shirt_size"
                                        label="Shirt Size"
                                        value={formData.shirt_size || ""}
                                        onChange={(e) => {
                                            handleChange("shirt_size", e.target.value);
                                        }}
                                    >
                                        <MenuItem value="XS">XS</MenuItem>
                                        <MenuItem value="S">S</MenuItem>
                                        <MenuItem value="M">M</MenuItem>
                                        <MenuItem value="L">L</MenuItem>
                                        <MenuItem value="XL">XL</MenuItem>
                                        <MenuItem value="XXL">XXL</MenuItem>
                                        <MenuItem value="XXXL">XXXL</MenuItem>
                                        <MenuItem value="n/a">N/A</MenuItem>
                                    </Select>
                                    
                                    {errors.shirt_size && (
                                         <FormHelperText>
                                            {errors.shirt_size ? "Shirt size is required" : ""}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </>
                        </Grid2>

                        {/* Link Info */}
                        <Grid2 item size={{ xs: 12, md: 6}}>
                            <TextField
                                fullWidth
                                label="Social Media Link (for NICP Contakt Card)"
                                variant="outlined"
                                error={errors.social_media}
                                helperText={errors.social_media ? "Social media link is required." : ""}
                                value={formData.social_media || ""}
                                onChange={(e) =>
                                    handleChange("social_media", e.target.value)
                                }
                            />
                        </Grid2>
                        <Grid2 item size={{ xs: 12, md: 6}}>
                            <TextField
                                fullWidth
                                label="Website Link (for NICP Contakt Card)"
                                variant="outlined"
                                error={errors.website}
                                helperText={errors.website ? "Website link is required." : ""}
                                value={formData.website || ""}
                                onChange={(e) =>
                                    handleChange("website", e.target.value)
                                }
                            />
                        </Grid2>

                        {/* Assets */}
                        <Grid2 item size={{ xs: 12, sm:6, md:4}}>
                            <CardMedia
                                component="img"
                                sx={{ height: 350, borderRadius: 2 }}
                                image={bagImage}
                                title="Bag"
                            />
                        </Grid2>
                        <Grid2 item size={{ xs: 12, sm:6, md:4}}>
                            <CardMedia
                                component="img"
                                sx={{ height: 300, borderRadius: 2 }}
                                image={shirtImage}
                                title="Shirt"
                            />
                        </Grid2>
                        <Grid2 item size={{ xs: 12, sm:12, md:4}}>
                            <CardMedia
                                component="img"
                                sx={{
                                    height: { xs: 200, sm: 300, md: 160, lg:200 },
                                    // objectFit: "cover",
                                    borderRadius: 2,
                                }}
                                image={cardImage}
                                title="Card"
                            />
                        </Grid2>
                    </Grid2>

                </Card>

                {/* Payment Info */}
                <Card variant="outlined" sx={{ p: 3, mb: 2, width: "100%" }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Payment Details:
                    </Typography>
                    <Typography variant="body1">
                        <strong>Account Name:</strong> National ICT Confederation of the Philippines (NICP), Inc.
                    </Typography>
                    <Typography variant="body1">
                        <strong>Bank:</strong> Bank of the Philippine Islands (BPI) Paseo De Roxas Branch
                    </Typography>
                    <Typography variant="body1">
                        <strong>Account Number:</strong> 1661-0098-76
                    </Typography>
                    <Typography variant="body1">
                        <strong>Account Type:</strong> Checking/Current
                    </Typography>
                </Card>

                {/* Agreement Info */}
                <Card variant="outlined" sx={{p:2, mb: 2, width:'100%' }}>
                    <Grid2 container spacing={2} rowSpacing={2}>
                        <Grid2 item size={{ xs: 12}}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value={formData.is_agree_privacy || false}
                                        onChange={(e) =>
                                            handleChange(
                                                "is_agree_privacy",
                                                e.target.checked
                                            )
                                        }
                                    />
                                }
                                label="I acknowledge that by submitting this registration form, I am committing to attend the event. In the event that I am unable to participate, I will promptly inform the event organizers to allow my slot to be allocated to another participant.

                                I agree to settle the registration fee promptly upon confirmation of my registration and to comply with the rules and regulations established by the 9th Convergence of Luzon ICT Champions Conference and Exhibition 2025 organizing committee.

                                In compliance with the Data Privacy Act of 2012, and its Implementing Rules and Regulations. I consent to providing the above information to NICP for purposes of registering in this event only.

                                Furthermore, I am aware that the details provided in this Google registration form will be included in the Contakt NICP Card for seamless networking during NICP events."
                            />
                            {errors.is_agree_privacy && (
                                <Typography color="error" variant="caption" sx={{pl:4}}>
                                    {errors.is_agree_privacy ? "Check is required" : ""}
                                </Typography>
                            )}
                        </Grid2>
                        <Grid2 item size={{ xs: 12}}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value={formData.agree_to_be_contacted || false}
                                        onChange={(e) =>
                                            handleChange(
                                                "agree_to_be_contacted",
                                                e.target.checked
                                            )
                                        }
                                    />
                                }
                                label='Do you consent to being contacted for future events? 
                                By checking, you agree to allow the event organizer and its partners to email or contact you regarding future events, updates, and opportunities.'
                            />
                        </Grid2>
                    </Grid2>
                </Card>
                
                {/* Submit Button */}
                <Grid2 container spacing={2} rowSpacing={2}>
                    {/* <Grid2 size={{ xs: 12, md: 6 }} offset={{ xs: 0, md: 3}}> */}
                    <Grid2 size={{ xs: 12}} sx={{mt:2}}>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            {isSaving ? "Saving..." : "Register"}
                        </Button>
                    </Grid2>
                </Grid2>
            </form>

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
                        Registration Successful!
                    </Typography>
                    <Typography id="success-modal-description" variant="body2">
                        Thank you for registering for the event. We look forward to seeing you!
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

export default Register;
