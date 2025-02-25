import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";
import { apiClient, getAuth } from "../../utils/authUtils";
import {
    Box,
    Button,
    Typography,
    Drawer,
    Slider,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormControl,
    Select, MenuItem, InputLabel
} from "@mui/material";
import Draggable from "react-draggable";

import qrcodeImg from "../../assets/qrcode.png";
import sampleId from "../../assets/sample-id.jpg";

const IdLayout = ({openDrawer, setOpenDrawer}) => {
    const { id } = useParams();
    const [backgroundImage, setBackgroundImage] = useState(sampleId);
    const [bgImageFile, setBgImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [idProp, setIdProp] = useState({ name: false, organization: false, qrcode: false });
    const [nameProp, setNameProp] = useState({size: 20, color: 'black', position: {x: 0, y: 120}});
    const [organizationProp, setOrganizationProp] = useState({size: 15, color: 'black', position: {x: 0, y: 130}});
    const [qrProp, setQrProp] = useState({size: 100, color: null, position: {x: 75, y: 150}});
    
    useEffect(() => {
        const fetchIdLayout = async () => {
            try {
                const response = await apiClient.get(`/api/events/id/fetch?event_id=${id}`);
                const { layout, bgimage } = response.data.data;
                const nameItem = layout.find((item) => item.type === "name");
                const organizationItem = layout.find((item) => item.type === "organization");
                const qrItem = layout.find((item) => item.type === "qrcode");
                
                if (bgimage) {
                    const url = import.meta.env.VITE_API_URL + bgimage;
                    setBackgroundImage(url);
                }

                if (nameItem) {
                    setNameProp(nameItem);
                    setIdProp((prev) => ({...prev, name: true}));
                } else {
                    setIdProp({...idProp, name: false});
                }
                if (organizationItem) {
                    setOrganizationProp(organizationItem);
                    setIdProp((prev) => ({...prev, organization: true}));
                } else {
                    setIdProp({...idProp, organization: false});
                }
                if (qrItem) {
                    setQrProp(qrItem);
                    setIdProp((prev) => ({...prev, qrcode: true}));
                } else {
                    setIdProp({...idProp, qrcode: false});
                }
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };
        if (openDrawer) {
            setLoading(true);
            fetchIdLayout();
            setLoading(false);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";  // Re-enable scrolling
        }
        return () => {
            document.body.style.overflow = "auto";  // Cleanup when unmounting
        };
    }, [openDrawer]);

    const handleIdPropertiesChange = (field, newValue) => {
        setIdProp({...idProp, [field]: newValue});
    };

    const handleNamePropChange = (field, newValue) => {
        setNameProp({...nameProp, [field]: newValue});
    };
    const handleOrgPropChange = (field, newValue) => {
        setOrganizationProp({...organizationProp, [field]: newValue});
    };
    const handleQrCodePropChange = (field, newValue) => {
        setQrProp({...qrProp, [field]: newValue});
    };

    const handleBgUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBgImageFile(file);
            const reader = new FileReader();
            reader.onload = (event) => setBackgroundImage(event.target.result);
            reader.readAsDataURL(file);
        }
    };

    const saveLayout = async() => {

        try {
                const formData = new FormData();
                formData.append("event_id", id);
                formData.append("layout", JSON.stringify([
                    { type: "name", ...nameProp },
                    { type: "organization", ...organizationProp },
                    { type: "qrcode", ...qrProp }
                ]));

                // Append image file if exists
                if (backgroundImage) {
                    formData.append("bgimage", bgImageFile);
                }

                const response = await apiClient.post(`/api/events/id/save`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                console.log(response.data);
                
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        setOpenDrawer(false);
    };

    return (
        <Drawer
            variant="persistent"
            sx={{
                "& .MuiDrawer-paper": {
                    width: "calc(100vw - 239px)", // Full width
                    height: "100vh", // Full height
                    maxWidth: "100%", // Prevent extra constraints
                    maxHeight: "100%", // Prevent extra constraints
                    backgroundColor: "#fff", // Set background color
                    // overflow: "hidden", // Ensure no internal scrolling
                },
            }}
            anchor="right"
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            >
            <Box sx={{ width: 600, p: 2 }}>
                <Typography variant="h6">ID Layout</Typography>

                {/* Upload Background Image */}
                <input type="file" accept="image/*" onChange={handleBgUpload} />
                
                <Typography sx={{ mt: 2 }} variant="body1">Check property to display on ID</Typography>
                
                <FormGroup>
                    {/* Name Checkbox & Font Size Slider */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FormControlLabel
                            label="Name"
                            control={
                                <Checkbox
                                    checked={idProp.name}
                                    onChange={(e) => handleIdPropertiesChange('name', e.target.checked)}
                                />
                            }
                        />
                        <Slider
                            value={nameProp.size}
                            onChange={(e, value) => handleNamePropChange('size', value)}
                            aria-labelledby="font-size-slider"
                            min={10}
                            max={50}
                            step={1}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${value}px`}
                            sx={{ width: 150 }}
                        />
                        {/* Font Color Selector */}
                        <FormControl sx={{ width: 100 }}>
                            <InputLabel>Color</InputLabel>
                            <Select
                                value={nameProp.color}
                                onChange={(e) => handleNamePropChange('color', e.target.value)}
                                label="Color"
                            >
                                <MenuItem value="black">Black</MenuItem>
                                <MenuItem value="white">White</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>


                    {/* Organization Checkbox & Font Size Slider */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FormControlLabel
                            label="Organization"
                            control={
                                <Checkbox
                                    checked={idProp.organization}
                                    onChange={(e) => handleIdPropertiesChange('organization', e.target.checked)}
                                />
                            }
                        />
                        <Slider
                            value={organizationProp.size}
                            onChange={(e, value) => handleOrgPropChange('size', value)}
                            aria-labelledby="font-size-slider"
                            min={10}
                            max={50}
                            step={1}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${value}px`}
                            sx={{ width: 150 }}
                        />
                        {/* Font Color Selector */}
                        <FormControl sx={{ width: 100 }}>
                            <InputLabel>Color</InputLabel>
                            <Select
                                value={organizationProp.color}
                                onChange={(e) => handleOrgPropChange('color', e.target.value)}
                                label="Color"
                            >
                                <MenuItem value="black">Black</MenuItem>
                                <MenuItem value="white">White</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* QR Code Checkbox */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FormControlLabel
                            label="QR Code"
                            control={
                                <Checkbox
                                    checked={idProp.qrcode}
                                    onChange={(e) => handleIdPropertiesChange('qrcode', e.target.checked)}
                                />
                            }
                        />
                        <Slider
                            value={qrProp.size}
                            onChange={(e, value) => handleQrCodePropChange('size', value)}
                            aria-labelledby="font-size-slider"
                            min={100}
                            max={200}
                            step={10}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${value}px`}
                            sx={{ width: 150 }}
                        />
                    </Box>
                </FormGroup>

                {/* ID Layout Preview */}
                <Box sx={{ mt: 2, mx: 'auto', p: 1, position: 'relative', width: 430*.6322, height: 430, border: '1px solid #ddd' }}>
                {/* <Box sx={{ mt: 2, mx: 'auto', position: 'relative', width: '153px', height: '242px', border: '1px solid #ddd' }}> */}
                    { backgroundImage && 
                        <Box style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundImage:`url(${backgroundImage})`,
                                width: '100%',
                                backgroundSize: "cover",
                                cursor: 'move',
                                height:'100%',
                            }}
                        />
                    }
                
                    {idProp.name && (
                        <Draggable
                            bounds="parent"
                            grid={[5, 5]}
                            position={nameProp.position}
                            onStop={(e, data) => {
                                setNameProp((prev) => ({
                                    ...prev,
                                    position: { x: data.x, y: data.y },
                                    size: prev.size,
                                    color: prev.color,
                                }));
                            }}
                        >
                            <Typography
                                sx={{
                                    cursor: 'move',
                                    textAlign: 'center',
                                    fontSize: nameProp.size,
                                    color: nameProp.color,
                                    fontWeight: 'bold',
                                }}
                            >
                                JUAN DELACRUZ
                            </Typography>
                        </Draggable>
                    )}
                    
                    {idProp.organization && (
                        <Draggable
                            bounds="parent"
                            grid={[5, 5]}
                            position={organizationProp.position}
                            onStop={(e, data) => {
                                setOrganizationProp((prev) => ({
                                    ...prev,
                                    position: { x: data.x, y: data.y },
                                    size: prev.size,
                                    color: prev.color,
                                }));
                            }}
                        >
                            <Typography
                                sx={{
                                    cursor: 'move',
                                    textAlign: 'center',
                                    fontSize: organizationProp.size,
                                    color: organizationProp.color,
                                    fontWeight: 'bold'
                                }}
                            >
                                SAMPLE ORGANIZATION
                            </Typography>
                        </Draggable>
                    )}

                    {idProp.qrcode && (
                        <Draggable
                            bounds="parent"
                            grid={[5, 5]}
                            position={qrProp.position}
                            onStop={(e, data) => {
                                setQrProp((prev) => ({
                                    ...prev,
                                    position: { x: data.x, y: data.y },
                                    size: prev.size,
                                }));
                            }}
                        >
                            <Box style={{
                                postion: 'absolute',
                                backgroundImage:`url(${qrcodeImg})`,
                                backgroundSize: "cover",
                                cursor: 'move',
                                width:qrProp.size,
                                height:qrProp.size,
                                textAlign: 'center',
                            }}>
                            </Box>
                        </Draggable>
                    )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}>
                <Button variant="outlined" onClick={() => setOpenDrawer(false)}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={saveLayout}>
                    Save Layout
                </Button>
                </Box>
            </Box>
        </Drawer>
    );
};

export default IdLayout;
