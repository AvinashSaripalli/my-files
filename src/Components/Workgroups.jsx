import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import axios from 'axios';

const Workgroups = () => {
  const [workgroups, setWorkgroups] = useState([]);

    const fetechWorkGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyName = localStorage.getItem("companyName"); 
      
      const response = await axios.get('http://localhost:5000/api/workgroups', {
        headers: { Authorization: `Bearer ${token}` },
        params: { companyName },
      });
      setWorkgroups(response.data);
    } catch (error) {
      console.error('Error fetching leave data:', error);
    }
  };

  useEffect(() => {
    fetechWorkGroups();
  }, []);

  return (
    <Box sx={{ pl: 6, pr: 6, mt: '30px' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Workgroups
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: '462px',
          overflowY: 'auto',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 12px',
        }}
      >
        <Table stickyHeader aria-label="workgroups table">
          <TableHead sx={{ backgroundColor: '#f4f7fe' , height:"80px"}}>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
                ID
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
                Company Name
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
                Date Created
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
                Privacy Type
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
                Total Emplooyees
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workgroups.length > 0 ? (
              workgroups.map((workgroup) => (
                <TableRow key={workgroup.id}>
                  <TableCell align="center">{workgroup.id}</TableCell>
                  <TableCell align="left">{workgroup.partnerCompanyName}</TableCell>
                  <TableCell align="left">{new Date(workgroup.createdOn).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell align="center">
                    
                      <Chip
                        label={workgroup.privacyType}
                          style={{ width: "100px", minWidth: "unset"}}
                      />                        
                  </TableCell>
                  <TableCell align="center">{workgroup.employees}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No workgroups found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Workgroups;