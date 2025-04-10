import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Box, Divider, Avatar, Menu, MenuItem, IconButton, Collapse, Tooltip, Typography, Button
} from '@mui/material';
import ApplyLeave from './ApplyLeave';
import MyLeaves from './MyLeaves';
import EmployeeProfile from './EmployeeProfile';
import WorkReports from './WorkReports';
import { useNavigate } from 'react-router-dom';
import {
  Activity, ArrowCircleLeft, ArrowCircleRight, LogoutCurve, Note,
  Notepad2, Profile
} from "iconsax-react";

const Sidebar = () => {
  const [selectedComponent, setSelectedComponent] = useState('My Leaves');
  const [loading, setLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [clockedIn, setClockedIn] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [clockInterval, setClockInterval] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setUserPhoto(localStorage.getItem('userPhoto') || '');
  }, []);

  const handleClockIn = () => {
    setClockedIn(true);
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    setClockInterval(interval);
  };

  const handleClockOut = () => {
    setClockedIn(false);
    clearInterval(clockInterval);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleListItemOnClick = (component) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedComponent(component);
      setLoading(false);
    }, 500);
  };

  const renderComponent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Loading...
        </Box>
      );
    }
    switch (selectedComponent) {
      case 'Work Reports': return <WorkReports />;
      case 'Apply Leave': return <ApplyLeave />;
      case 'My Leaves': return <MyLeaves />;
      case 'Profile': return <EmployeeProfile />;
      default: return <MyLeaves />;
    }
  };

  const handleAvatarClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const formatElapsedTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ background: '#fff', boxShadow: 'none', borderBottom: '1px solid #e0e0e0', zIndex: 1201 }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, gap: 2 }}>
            <Button
              size="small" variant={clockedIn ? "outlined" : "outlined"}
              onClick={clockedIn ? handleClockOut : handleClockIn}
              sx={{
                color: clockedIn ? "#f11005" : "#14286D",
                //backgroundColor: clockedIn ? "#14286D" : "#fff",
                borderColor: "#14286D",
                fontWeight: 600,
              }}
            >
              {clockedIn ? "Clock Out" : "Clock In"}
            </Button>
            <Typography sx={{ color: '#14286D', fontWeight: 600 }}>
              {formatElapsedTime(elapsedSeconds)}
            </Typography>
          </Box>

          <Tooltip title="Profile">
            <Avatar src={userPhoto} sx={{ cursor: 'pointer' }} onClick={handleAvatarClick} />
          </Tooltip>
          <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => { handleListItemOnClick('Profile'); handleMenuClose(); }}>Profile</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{
        '& .MuiDrawer-paper': {
          width: sidebarOpen ? 200 : 60,
          transition: 'width 0.3s',
          overflowX: 'hidden',
          boxSizing: 'border-box',
          background: '#ffffff',
          color: '#14286D',
          zIndex: 1300,
        },
      }}>
        <List>
          <ListItem disablePadding onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ mt: 1.8, mb: 1.8, justifyContent: 'center' }}>
            <img
              src={sidebarOpen ? '/image 25.png' : '/image 26.png'}
              alt="Company Logo"
              style={{ height: '26px', width: 'auto', cursor: 'pointer', objectFit: 'contain' }}
            />
          </ListItem>
          <Divider />
          {[
            {
              text: 'Work Reports',
              icon: selectedComponent === 'Work Reports'
                ? <Activity size="25" variant="Bold" />
                : <Activity size="25" variant="Outline" />
            },
            {
              text: 'Apply Leave',
              icon: selectedComponent === 'Apply Leave'
                ? <Note size="25" variant="Bold" />
                : <Note size="25" variant="Outline" />
            },
            {
              text: 'My Leaves',
              icon: selectedComponent === 'My Leaves'
                ? <Notepad2 size="25" variant="Bold" />
                : <Notepad2 size="25" variant="Outline" />
            },
            {
              text: 'Profile',
              icon: selectedComponent === 'Profile'
                ? <Profile size="25" variant="Bold" />
                : <Profile size="25" variant="Outline" />
            }
          ].map(({ text, icon }) => (
            <ListItem sx={{ justifyContent: 'center', height: '60px' }} disablePadding key={text}>
              <ListItemButton onClick={() => handleListItemOnClick(text)}>
                <ListItemIcon sx={{ color: '#14286D' }}>{icon}</ListItemIcon>
                <Collapse in={sidebarOpen} orientation="horizontal">
                  <ListItemText primary={text} />
                </Collapse>
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem sx={{ justifyContent: 'center' }} disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ color: '#14286D' }}><LogoutCurve size="25" /></ListItemIcon>
              <Collapse in={sidebarOpen} orientation="horizontal"><ListItemText primary="Logout" /></Collapse>
            </ListItemButton>
          </ListItem>
          <ListItem sx={{ justifyContent: sidebarOpen ? 'flex-end' : 'center', mt: '250px' }}>
            <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: '#000' }}>
              {sidebarOpen ? <ArrowCircleLeft size="22" color="#14286d" /> : <ArrowCircleRight size="24" color="#14286d" />}
            </IconButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{
        flexGrow: 1,
        mt: "64px",
        ml: '60px',
        backgroundColor: '#f4f7fe',
        minHeight: "calc(100vh - 64px)",
        width: "100vh",
      }}>
        {renderComponent()}
      </Box>
    </Box>
  );
};

export default Sidebar;

