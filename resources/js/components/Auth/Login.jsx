import React from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Login = () => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            bgcolor: '#f5f5f5',
        }}
    >
        <Typography variant="h4" sx={{ mb: 3 }}>
            Login
        </Typography>
        <Box sx={{ width: '450px' }}>
            <TextField fullWidth label="Email" variant="outlined" size="small" sx={{ mb: 2 }} />
            <TextField fullWidth label="Password" variant="outlined" size="small" type="password" sx={{ mb: 2 }} />
            <Button fullWidth variant="contained" color="primary" sx={{ mb: 2 }}>
                Login
            </Button>
            <Typography>
                Don't have an account? <Link to="/register">Register here</Link>.
            </Typography>
        </Box>
    </Box>
);

export default Login;
