import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip } from '@mui/material';
import axios from 'axios';

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:5000/api/leaves/leave', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leave data:', error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleUpdateStatus = async (leaveId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put('http://localhost:5000/api/leaves/update-status', 
        { leaveId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLeaves();
    } catch (error) {
      console.error(`Error updating leave status to ${status}:`, error);
    }
  };

  return (
    <Box sx={{ pl: 10, pr: 10, mt: '30px' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Leave Management</Typography>

      <TableContainer component={Paper} sx={{
        maxHeight: '462px',
        overflowY: 'auto',
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 12px",
      }}>
        <Table stickyHeader aria-label="leaves table">
          <TableHead sx={{ backgroundColor: '#f4f7fe' }}>
            <TableRow>
              <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Employee ID</TableCell>
              <TableCell align='left' sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Leave Type</TableCell>
              <TableCell align='left' sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Start Date</TableCell>
              <TableCell align='left' sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>End Date</TableCell>
              <TableCell align='left' sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Reason</TableCell>
              <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaves.length > 0 ? (
              leaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell align='center'>{leave.employeeId}</TableCell>
                  <TableCell align='left'>{leave.leave_type}</TableCell>
                  <TableCell align='left'>{new Date(leave.start_date).toLocaleDateString()}</TableCell>
                  <TableCell align='left'>{new Date(leave.end_date).toLocaleDateString()}</TableCell>
                  <TableCell align='left'>{leave.reason}</TableCell>
                  <TableCell align="left">
                    {leave.status === 'Pending' ? (
                      <>
                        <Button 
                          variant="contained" 
                          color="success" 
                          onClick={() => handleUpdateStatus(leave.id, 'Approved')}
                          sx={{ mr: 1 }}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="contained" 
                          color="error" 
                          onClick={() => handleUpdateStatus(leave.id, 'Rejected')}
                        >
                          Reject
                        </Button>
                      </>
                    ) : <>
                    <Chip variant="contained"
                    label={leave.status}
                    color={
                      leave.status === 'Approved' ? 'success' :
                      leave.status === 'Rejected' ? 'error' : 'warning'
                    }
                    
                  />
                  </>
                  }
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  No leave records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageLeaves;
