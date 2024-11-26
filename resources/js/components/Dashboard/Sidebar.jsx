import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = () => (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
        <List>
            <ListItem button component={Link} to="/dashboard/events">
                <ListItemText primary="Event List" />
            </ListItem>
            <ListItem button component={Link} to="/dashboard/profile">
                <ListItemText primary="User Profile" />
            </ListItem>
        </List>
    </Drawer>
);

export default Sidebar;
