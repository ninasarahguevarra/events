import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Events from './components/Events/Events';
import EventDetails from './components/Events/EventDetails';
import Registrants from './components/Registrants/Registrants';
import Sidebar from './components/Dashboard/Sidebar';
import { getAuth } from './utils/authUtils';  // Assuming this utility checks if the user is authenticated
import { Box } from '@mui/material';


function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const authStatus = getAuth();
            setIsAuthenticated(authStatus);
        };
        checkAuthStatus();
    }, []);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
           
            <Router>
                <Box sx={{ display: 'flex', backgroundColor: '#ffffff'  }}>
                    {isAuthenticated && <Sidebar />}
                    <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#ffffff' }}>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/dashboard/*" element={<Dashboard />} />
                            <Route path="/events/*" element={<Events />} />
                            <Route path="/events/:id" element={<EventDetails />} />
                            <Route path="/registrants/:id" element={<Registrants />} />
                        </Routes>
                    </Box>
                </Box>
            </Router>
            
        </ThemeProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
