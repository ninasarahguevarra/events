import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = () => (
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
        </List>
    </Drawer>
);

export default Sidebar;
