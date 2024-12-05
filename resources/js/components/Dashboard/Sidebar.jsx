import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { styled, useTheme } from "@mui/material/styles";
import {
    Box,
    Toolbar,
    List,
    CssBaseline,
    Typography,
    Divider,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    AppBar,
    IconButton,
    Avatar,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardSharpIcon from "@mui/icons-material/DashboardSharp";
import EventIcon from "@mui/icons-material/Event";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { Link, useNavigate } from "react-router-dom";
import { clearAuth, apiClient } from "../../utils/authUtils";

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    variants: [
        {
            props: ({ open }) => open,
            style: {
                ...openedMixin(theme),
                "& .MuiDrawer-paper": openedMixin(theme),
            },
        },
        {
            props: ({ open }) => !open,
            style: {
                ...closedMixin(theme),
                "& .MuiDrawer-paper": closedMixin(theme),
            },
        },
    ],
}));

function Sidebar(props) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleMobileDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleMobileDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleMobileDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const handleLogout = async () => {
        try {
            handleMobileDrawerClose();
            await apiClient.get(`/api/users/logout`);
            clearAuth();
            navigate("/");
            window.location.reload();
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const handleRedirection = async (link) => {
        navigate(link);
        handleMobileDrawerClose();
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await apiClient.get(`/api/users/info`);
                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };
        fetchUserInfo();
    }, []);

    if (!user) return null;

    const menu = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <DashboardSharpIcon />,
        },
        {
            name: "Events",
            path: "/events",
            icon: <EventIcon />,
        },
    ];

    const mobileDrawer = (
        <>
            <Box sx={{ p: 2, textAlign: "center" }}>
                <Avatar
                    sx={{
                        bgcolor: "blue",
                        width: 56,
                        height: 56,
                        margin: "0 auto",
                    }}
                >
                    {user.name.charAt(0)}
                </Avatar>
                <Typography variant="h6" sx={{ mt: 1 }}>
                    {user.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {user.email}
                </Typography>
            </Box>
            <Divider />
            <List
            // sx={{ flexGrow: 1 }}
            >
                {menu.map((item) => (
                    <ListItem
                        key={item.name}
                        disablePadding
                        button
                        onClick={() => handleRedirection(item.path)}
                    >
                        <ListItemButton>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem disablePadding button onClick={handleLogout}>
                    <ListItemButton>
                        <ListItemIcon>
                            <ExitToAppIcon sx={{ mr: 1 }} />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </>
    );

    const container =
        props.window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    display: { sm: "none" },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleMobileDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{
                    width: { sm: drawerWidth },
                    flexShrink: { sm: 0 },
                    display: { sm: "none" },
                }}
                aria-label="mailbox folders"
            >
                <MuiDrawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleMobileDrawerTransitionEnd}
                    onClose={handleMobileDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        flexShrink: 0,
                        display: {
                            xs: "flex",
                            sm: "none",
                            flexDirection: "column",
                        },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {mobileDrawer}
                </MuiDrawer>
            </Box>

            <Drawer
                variant="permanent"
                open={open}
                sx={{ display: { xs: "none", sm: "block" } }}
            >
                <DrawerHeader>
                    {open ? (
                        <>
                            <Box sx={{ p: 2, textAlign: "center" }}>
                                <Avatar
                                    sx={{
                                        bgcolor: "blue",
                                        width: 56,
                                        height: 56,
                                        margin: "0 auto",
                                    }}
                                >
                                    {user.name.charAt(0)}
                                </Avatar>
                                <Typography variant="h6" sx={{ mt: 1 }}>
                                    {user.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    {user.email}
                                </Typography>
                            </Box>
                            <IconButton onClick={handleDrawerClose}>
                                {theme.direction === "rtl" ? (
                                    <ChevronRightIcon />
                                ) : (
                                    <ChevronLeftIcon />
                                )}
                            </IconButton>
                        </>
                    ) : (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={[
                                open && {
                                    display: "none",
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                </DrawerHeader>
                <Divider />
                <List>
                    {menu.map((item, index) => (
                        <ListItem
                            key={item.name}
                            disablePadding
                            sx={{ display: "block" }}
                            button
                            onClick={() => handleRedirection(item.path)}
                        >
                            <ListItemButton
                                sx={[
                                    {
                                        minHeight: 48,
                                        px: 2.5,
                                    },
                                    open
                                        ? {
                                              justifyContent: "initial",
                                          }
                                        : {
                                              justifyContent: "center",
                                          },
                                ]}
                            >
                                <ListItemIcon
                                    sx={[
                                        {
                                            minWidth: 0,
                                            justifyContent: "center",
                                        },
                                        open
                                            ? {
                                                  mr: 3,
                                              }
                                            : {
                                                  mr: "auto",
                                              },
                                    ]}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.name}
                                    sx={[
                                        open
                                            ? {
                                                  opacity: 1,
                                              }
                                            : {
                                                  opacity: 0,
                                              },
                                    ]}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem
                        disablePadding
                        sx={{ display: "block" }}
                        button
                        onClick={handleLogout}
                    >
                        <ListItemButton
                            sx={[
                                {
                                    minHeight: 48,
                                    px: 2.5,
                                },
                                open
                                    ? {
                                          justifyContent: "initial",
                                      }
                                    : {
                                          justifyContent: "center",
                                      },
                            ]}
                        >
                            <ListItemIcon
                                sx={[
                                    {
                                        minWidth: 0,
                                        justifyContent: "center",
                                    },
                                    open
                                        ? {
                                              mr: 3,
                                          }
                                        : {
                                              mr: "auto",
                                          },
                                ]}
                            >
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Logout"
                                sx={[
                                    open
                                        ? {
                                              opacity: 1,
                                          }
                                        : {
                                              opacity: 0,
                                          },
                                ]}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </Box>
    );
}

Sidebar.propTypes = {
    window: PropTypes.func,
};

export default Sidebar;
