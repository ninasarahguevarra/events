import React, { useEffect } from 'react';
import { Button, TextField, Box, Typography, FormControl, FormLabel, Select, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { setAuth, apiClient, getAuth } from "../../utils/authUtils";

const Register = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (getAuth()) {
            navigate("/dashboard");
        }
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: '#ffffff',
            }}
        >
            <Typography variant="h4" sx={{ mb: 3 }}>
                Register
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '600px' }}>
                <Box sx={{ width: '48%' }}>
                    <TextField fullWidth label="Title" variant="outlined" size="small" sx={{ mb: 2 }} />
                    <TextField fullWidth label="Email" variant="outlined" size="small" sx={{ mb: 2 }} />
                    <FormControl sx={{ mb: 2 }}>
                        <FormLabel id="gender-label">Gender</FormLabel>
                        <Select
                            labelId="gender-label"
                            id="gender-select"
                            defaultValue="male"
                            size="small"
                        >
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField fullWidth label="Password" variant="outlined" size="small" type="password" sx={{ mb: 2 }} />
                </Box>
                <Box sx={{ width: '48%' }}>
                    <TextField fullWidth label="Name" variant="outlined" size="small" sx={{ mb: 2 }} />
                    <TextField fullWidth label="Company" variant="outlined" size="small" sx={{ mb: 3 }} />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Birthdate"
                            size="small"
                            sx={{ width: '100%', mb: 2 }}
                        />
                    </LocalizationProvider>
                    <TextField fullWidth label="Confirm Password" variant="outlined" size="small" type="password" sx={{ mb: 2 }} />
                </Box>
            </Box>
            <Box sx={{ width: '600px', textAlign: 'center' }}>
                <Button fullWidth variant="contained" color="primary" sx={{ mb: 2 }}>
                    Register
                </Button>
                <Typography>
                    Already have an account? <Link to="/">Login here</Link>.
                </Typography>
            </Box>
        </Box>
    )
};

export default Register;