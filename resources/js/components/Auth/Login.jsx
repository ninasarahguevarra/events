import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { setAuth, apiClient } from "../../utils/authUtils";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            setError(null);

            const response = await apiClient.post(`/api/login`, {
                email,
                password,
            });

            const { token, user_info } = response.data;

            setAuth(token)

            navigate('/dashboard');
            window.location.reload();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'An error occurred. Please try again.';
            setError(errorMsg);
        }
    };

    return (
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
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    size="small"
                    type="password"
                    sx={{ mb: 2 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    sx={{ py: 1.5, fontSize: "1rem" }} 
                    onClick={handleLogin}
                >
                    Login
                </Button>

                {/* <Typography>
                    Don't have an account? <Link to="/register">Register here</Link>.
                </Typography> */}
            </Box>
        </Box>
    );
};

export default Login;
