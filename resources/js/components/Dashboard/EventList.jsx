import React from 'react';
import { Box, Typography } from '@mui/material';

const EventList = () => (
    <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
            Events
        </Typography>
        <Typography>No events available. Add your first event!</Typography>
    </Box>
);

export default EventList;
