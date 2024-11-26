import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import { Routes, Route } from 'react-router-dom';
import Events from '../Events/Events';
import Profile from './Profile';

const Dashboard = () => (
    <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
                <Route path="events" element={<Events />} />
                <Route path="profile" element={<Profile />} />
            </Routes>
        </Box>
    </Box>
);

export default Dashboard;
