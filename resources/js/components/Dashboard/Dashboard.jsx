import React from 'react';
import { Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Events from '../Events/Events';
import Registrants from '../Registrants/Registrants';

const Dashboard = () => (
    <Box sx={{ display: 'flex' }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
                <Route path="events" element={<Events />} />
                <Route path="registrants" element={<Registrants />} />
            </Routes>
        </Box>
    </Box>
);

export default Dashboard;
