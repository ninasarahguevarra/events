import React, { useEffect, useState } from "react";
import { Drawer, List, ListItem, ListItemText, Avatar, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { clearAuth, apiClient } from "../../utils/authUtils";

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
            clearAuth();
            navigate("/");
            window.location.reload();
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
                "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box", display: "flex", flexDirection: "column" },
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
            <Box sx={{ flexGrow: 1 }}>
                <List>
                    <ListItem button component={Link} to="/dashboard">
                        <PeopleIcon sx={{ mr: 1 }} />
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button component={Link} to="/events">
                        <EventIcon sx={{ mr: 1 }} />
                        <ListItemText primary="Events" />
                    </ListItem>
                </List>
            </Box>
            <Box>
                <List>
                    <ListItem button onClick={handleLogout}>
                        <ExitToAppIcon sx={{ mr: 1 }} />
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
