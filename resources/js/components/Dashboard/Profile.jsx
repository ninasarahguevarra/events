import React from 'react';
import { Box, Typography } from '@mui/material';

const Profile = () => (
    <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
            User Profile
        </Typography>
        <Typography>Name: John Doe</Typography>
        <Typography>Email: john.doe@example.com</Typography>
    </Box>
);

export default Profile;
