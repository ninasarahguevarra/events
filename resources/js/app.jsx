import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import EventList from './components/Events/Events';
import Registrants from './components/Registrants/Registrants';
import Sidebar from './components/Dashboard/Sidebar';
import { Box } from '@mui/material';


function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
           
            <Router>
                <Box sx={{ display: 'flex' }}>
                    <Sidebar />
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/dashboard/*" element={<Dashboard />} />
                            <Route path="/events/*" element={<EventList />} />
                            <Route path="/registrants/*" element={<Registrants />} />
                        </Routes>
                    </Box>
                </Box>
            </Router>
            
        </ThemeProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
