import React, { useEffect, useState } from "react";
import { Button, TextField, Box, Typography, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { setAuth, apiClient, getAuth } from "../../utils/authUtils";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            setError(null);

            const response = await apiClient.post(`/api/login`, {
                email,
                password,
            });

            const { token } = response.data;

            setAuth(token);

            navigate("/dashboard");
            window.location.reload();
        } catch (err) {
            const errorMsg = err.response?.data?.message || "An error occurred. Please try again.";
            setError(errorMsg);
        }
    };

    useEffect(() => {
        if (getAuth()) {
            navigate("/dashboard");
        }
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                bgcolor: "#ffffff",
                px: 2, // Padding for smaller screens
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    mb: 3,
                    textAlign: "center",
                    fontSize: { xs: "1.8rem", sm: "2.5rem" }, // Smaller font size on mobile
                }}
            >
                Login
            </Typography>
            <Box
                sx={{
                    width: { xs: "100%", sm: "450px" }, // Full width on mobile, fixed width on larger screens
                }}
            >
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
                    sx={{
                        py: 1.5,
                        fontSize: "1rem",
                        mb: 2, // Adds spacing below button
                    }}
                    onClick={handleLogin}
                >
                    Login
                </Button>
                {/* Optional registration link */}
                {/* <Typography
                    variant="body2"
                    sx={{
                        textAlign: "center",
                        fontSize: { xs: "0.85rem", sm: "1rem" },
                    }}
                >
                    Don't have an account?{" "}
                    <Link to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
                        Register here
                    </Link>
                    .
                </Typography> */}
            </Box>
        </Box>
    );
};

export default Login;
