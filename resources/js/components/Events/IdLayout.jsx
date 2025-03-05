import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../../utils/authUtils";
import {
    Box,
    Button,
    Typography,
    Drawer,
    Slider,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormControl, Divider, Grid2,
    Select, MenuItem,
} from "@mui/material";
import Draggable from "react-draggable";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { styled } from '@mui/material/styles';

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

import qrcodeImg from "../../assets/qrcode.png";
// import sampleId from "../../assets/sample-id.jpg";

const IdLayout = ({openDrawer, setOpenDrawer}) => {
    const { id } = useParams();
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [bgImageFile, setBgImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectName, setSelectName] = useState(false);
    const [selectOrganization, setSelectOrganization] = useState(false);
    const [selectQrcode, setSelectQrcode] = useState(false);
    const [nameProp, setNameProp] = useState({size: 24, color: '#000', position: {x: 0, y: 120}});
    const [organizationProp, setOrganizationProp] = useState({size: 16, color: '#000', position: {x: 0, y: 130}});
    const [qrProp, setQrProp] = useState({size: 120, color: null, position: {x: 75, y: 150}});
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);
    
    useEffect(() => {
        const fetchIdLayout = async () => {
            try {
                const response = await apiClient.get(`/api/events/id/fetch?event_id=${id}`);
                
                const { layout, bgimage } = response.data.data;
                const nameItem = layout ? layout.find((item) => item.type === "name") : null;
                const organizationItem = layout ? layout.find((item) => item.type === "organization") : null;
                const qrItem = layout ? layout.find((item) => item.type === "qrcode") : null;
                
                if (bgimage) {
                    const url = import.meta.env.VITE_API_URL + bgimage;
                    setBackgroundImage(url);
                }

                if (nameItem) {
                    setNameProp(nameItem);
                    setSelectName(true)
                } else {
                    setSelectName(false)
                }
                if (organizationItem) {
                    setOrganizationProp(organizationItem);
                    setSelectOrganization(true);
                } else {
                    setSelectOrganization(false);
                }
                if (qrItem) {
                    setQrProp(qrItem);
                    setSelectQrcode(true);
                } else {
                    setSelectQrcode(false);
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

    const handleNamePropChange = (field, newValue) => {
        setNameProp({...nameProp, [field]: newValue});
    };
    const handleOrgPropChange = (field, newValue) => {
        setOrganizationProp({...organizationProp, [field]: newValue});
    };
    const handleQrCodePropChange = (field, newValue) => {
        setQrProp({...qrProp, [field]: newValue});
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFileName(selectedFile.name);
            handleBgUpload(selectedFile);
        }
    };

    const handleBgUpload = (file) => {
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
                const layout = [];

                if (selectName) {
                    layout.push({ type: "name", ...nameProp });
                }
                if (selectOrganization) {
                    layout.push({ type: "organization", ...organizationProp });
                }
                if (selectQrcode) {
                    layout.push({ type: "qrcode", ...qrProp });
                }

                formData.append("layout", JSON.stringify(layout));

                // Append image file if exists
                if (backgroundImage) {
                    formData.append("bgimage", bgImageFile);
                }

                const response = await apiClient.post(`/api/events/id/save`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

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
                    width: "calc(100vw - 45%)",
                    // width: "calc(100vw - 239px)",
                    height: "100vh",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    backgroundColor: "#fff",
                },
            }}
            anchor="right"
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            >
            <Box sx={{ width: '100%', py: 2, px: 4, position: 'relative' }}>
                <Typography variant="h6">ID Layout</Typography>
                <Divider />

                <Grid2 container spacing={2} rowSpacing={2}>
                    <Grid2 item size={{ xs: 12, md: 6 }}>

                        <Typography sx={{ mt: 2 }} variant="body1">Select Fields to Appear on ID</Typography>
                        
                        <FormGroup>
                            {/* Name Checkbox & Font Size Slider */}
                            <Box sx={{p: 1, border: '1px solid #ddd', borderRadius: 1, my: 2}}>
                                <FormControlLabel
                                    label="Name"
                                    control={
                                        <Checkbox
                                            checked={selectName}
                                            onChange={(e) => setSelectName(e.target.checked)}
                                        />
                                    }
                                />
                                { selectName &&
                                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <Slider
                                            value={nameProp.size}
                                            onChange={(e, value) => handleNamePropChange('size', value)}
                                            aria-labelledby="font-size-slider"
                                            min={10}
                                            max={36}
                                            step={1}
                                            valueLabelDisplay="auto"
                                            valueLabelFormat={(value) => `${value}px`}
                                            sx={{ width: 200 }}
                                        />
                                        {/* Font Color Selector */}
                                        <FormControl sx={{ width: 100 }} size="small">
                                            <Select
                                                value={nameProp.color}
                                                onChange={(e) => handleNamePropChange('color', e.target.value)}
                                            >
                                                <MenuItem value="black">Black</MenuItem>
                                                <MenuItem value="white">White</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                }
                            </Box>


                            {/* Organization Checkbox & Font Size Slider */}
                            <Box sx={{p: 1, border: '1px solid #ddd', borderRadius: 1, my: 2}}>
                                <FormControlLabel
                                    label="Organization"
                                    control={
                                        <Checkbox
                                            checked={selectOrganization}
                                            onChange={(e) => setSelectOrganization(e.target.checked)}
                                        />
                                    }
                                />
                                { selectOrganization &&
                                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <Slider
                                            value={organizationProp.size}
                                            onChange={(e, value) => handleOrgPropChange('size', value)}
                                            aria-labelledby="font-size-slider"
                                            min={10}
                                            max={30}
                                            step={1}
                                            valueLabelDisplay="auto"
                                            valueLabelFormat={(value) => `${value}px`}
                                            sx={{ width: 200 }}
                                        />
                                        {/* Font Color Selector */}
                                        <FormControl sx={{ width: 100 }} size="small">
                                            <Select
                                                value={organizationProp.color}
                                                onChange={(e) => handleOrgPropChange('color', e.target.value)}
                                            >
                                                <MenuItem value="black">Black</MenuItem>
                                                <MenuItem value="white">White</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                }
                            </Box>

                            {/* QR Code Checkbox */}
                            <Box sx={{display: 'flex', alignItems: 'center', p: 1, border: '1px solid #ddd', borderRadius: 1, my: 2}}>
                                <FormControlLabel
                                    label="QR Code"
                                    control={
                                        <Checkbox
                                            checked={selectQrcode}
                                            onChange={(e) => setSelectQrcode(e.target.checked)}
                                        />
                                    }
                                />
                                { selectQrcode &&
                                    <Slider
                                        value={qrProp.size}
                                        onChange={(e, value) => handleQrCodePropChange('size', value)}
                                        aria-labelledby="font-size-slider"
                                        min={100}
                                        max={200}
                                        step={10}
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={(value) => `${value}px`}
                                        sx={{ width: 200 }}
                                    />
                                }
                            </Box>
                        </FormGroup>

                        {/* Upload Background Image */}
                        <Box>
                            <Button
                                loading
                                // fullWidth
                                loadingPosition="end"
                                variant="outlined"
                                color="primary"
                                onClick={handleButtonClick}
                                tabIndex={-1}
                                startIcon={<FileUploadIcon />}
                            >
                                Upload Background Image
                                <VisuallyHiddenInput
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </Button>
                            <Typography sx={{fontSize: '12px', mt:0.5, color: '#656464'}}>Suggested image dimension: width: 638px, height: 1012px</Typography>
                            {fileName && <Typography>{fileName}</Typography>}
                        </Box>
                    </Grid2>

                    {/* ID Layout Preview */}
                    <Grid2 sx={{display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }}} item size={{ xs: 12, md: 6 }}>
                        <Box>
                            <Typography sx={{ my: 2 }} variant="body1">Preview</Typography>
                            <Box sx={{ position: 'relative', width: 255.2, height: 404.8, border: '1px solid #ddd' }}>
                            {/* <Box sx={{ mt: 2, p: 1, position: 'relative', width: 430*.6322, height: 430, border: '1px solid #ddd' }}> */}
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
                            
                                {selectName && (
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
                                                lineHeight: 1.1
                                            }}
                                        >
                                            JUAN DELACRUZ
                                        </Typography>
                                    </Draggable>
                                )}
                                
                                {selectOrganization && (
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
                                                fontWeight: 'bold',
                                                lineHeight: 1.1
                                            }}
                                        >
                                            SAMPLE ORGANIZATION
                                        </Typography>
                                    </Draggable>
                                )}

                                {selectQrcode && (
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
                        </Box>
                    </Grid2>

                    <Grid2 sx={{display: 'flex', justifyContent: 'flex-end', mt: 3}} item size={{ xs: 12 }}>
                        <Box>
                            <Button sx={{mr: 2}} variant="outlined" onClick={() => setOpenDrawer(false)}>
                                Cancel
                            </Button>
                            <Button variant="contained" onClick={saveLayout}>
                                Save Layout
                            </Button>
                        </Box>
                    </Grid2>
                </Grid2>
            </Box>
        </Drawer>
    );
};

export default IdLayout;
