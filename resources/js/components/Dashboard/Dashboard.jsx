import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import { Routes, Route } from 'react-router-dom';
import EventList from './EventList';
import Profile from './Profile';

const Dashboard = () => (
    <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
                <Route path="events" element={<EventList />} />
                <Route path="profile" element={<Profile />} />
            </Routes>
        </Box>
    </Box>
);

export default Dashboard;
