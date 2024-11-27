import React, { useEffect, useState } from "react";
import { Drawer, List, ListItem, ListItemText, Avatar, Typography, Box, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import apiClient from "../../utils/axios";

const Sidebar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await apiClient.get(`/api/users/info`);
                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };
        fetchUserInfo();
    }, []);

    const handleLogout = async () => {
        try {
            await apiClient.get(`/api/users/logout`);
            localStorage.removeItem("authToken");
            navigate("/");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    if (!user) return null;

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
            }}
        >
            <Box sx={{ p: 2, textAlign: "center" }}>
                <Avatar sx={{ bgcolor: "blue", width: 56, height: 56, margin: "0 auto" }}>
                    {user.name.charAt(0)}
                </Avatar>
                <Typography variant="h6" sx={{ mt: 1 }}>
                    {user.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {user.email}
                </Typography>
            </Box>
            <List>
                <ListItem button component={Link} to="/dashboard">
                    <PeopleIcon sx={{ mr: 1 }} />
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/events">
                    <EventIcon sx={{ mr: 1 }} />
                    <ListItemText primary="Events" />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                    <ExitToAppIcon sx={{ mr: 1 }} />
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
