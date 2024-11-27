import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from "../../utils/axios";

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await apiClient.get(`/api/users/logout`);
            localStorage.removeItem("authToken");
            navigate("/");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
            }}
        >
            <List>
                <ListItem button component={Link} to="/events">
                    <ListItemText primary="Events" />
                </ListItem>
                <ListItem button component={Link} to="/registrants">
                    <ListItemText primary="Registrants" />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
