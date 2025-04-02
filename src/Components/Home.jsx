import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent } from '@mui/material';
//import homeImage from './pexels-mikebirdy-3729464.jpg'; 
const Home = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Home
      </Typography>

      <Card sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
        <CardMedia
          component="img"
          //image= {homeImage}
          alt="Home"
          sx={{ width: '100%', height: 'auto' }}
        />
        
        <TextField
          variant="outlined"
          fontSize="2px"
          onchange={handlechange}
          name="first Name"
          label="First Name"
          type="firstName"
          value={formValues.firstName}
        />
        <TextField
          variant="contained"
          name="lastName"
          margin="dense"
          fullWidth
          type="lastName"
          value={formValues.lastName}
        />
        <TextField
          variant='outlined'
          name="password"
          margin="dense"
          maxWidth
          maxHeight
          type="password"
          label="Password"
          fullWidth
          inputProps="read-only"
          value={formValues.password}
        />
        
        <TextField
          label="Designation"
          name="designation"
          onchange={handleChange}
          fullWidth
          value={formValues.designation}
          variant="outlined"
        />
        <TextField
          label="Job Location"
          name="jobLocation"
          fullWidth
          value={formValues.jobLocation}
          onChange={handleChange}
        />
        
        <CardContent>
          <Typography variant="h6" component="div">
            AMG® is short for Aufecht, Melcher, and Großaspach, the division of Mercedes-Benz that produces performance vehicles. 
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Home;