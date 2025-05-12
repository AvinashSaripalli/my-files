import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Chip, TablePagination, Grid, Card, CardContent
} from '@mui/material';
import axios from 'axios';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5); 

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyName = localStorage.getItem("companyName"); 
      
      const response = await axios.get('http://localhost:5000/api/leaves/leave', {
        headers: { Authorization: `Bearer ${token}` },
        params: { companyName },
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

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ display: 'flex', pl: 5, pr: 5, mt: '60px' }}>
      <Box sx={{ flex: 1 ,gap: 4.8}}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Leave Management</Typography>

        <TableContainer component={Paper} sx={{
          maxHeight: '462px',
          overflowY: 'auto',
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 12px",
        }}>
          <Table stickyHeader aria-label="leaves table">
            <TableHead sx={{ backgroundColor: '#f4f7fe', height:"80px" }} >
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
                leaves
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((leave, index) => (
                    <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },maxHeight: '60px', }}>
                      <TableCell align='center'>{leave.employeeId}</TableCell>
                      <TableCell align='left'>{leave.leave_type}</TableCell>
                      <TableCell align='left'>{new Date(leave.start_date).toLocaleDateString('en-GB')}</TableCell>
                      <TableCell align='left'>{new Date(leave.end_date).toLocaleDateString('en-GB')}</TableCell>
                      <TableCell align='left'>{leave.reason}</TableCell>
                      <TableCell align="left">
                        {leave.status === 'Pending' ? (
                          <Box sx={{ display: 'inline-flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleUpdateStatus(leave.id, 'Approved')}
                              sx={{ mr: 1 }}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => handleUpdateStatus(leave.id, 'Rejected')}
                            >
                              Reject
                            </Button>
                          </Box>
                        ) : (
                          <Chip
                            label={leave.status}
                            color={
                              leave.status === 'Approved' ? 'success' :
                              leave.status === 'Rejected' ? 'error' : 'warning'
                            }
                            style={{ width: "100px", minWidth: "unset"}}
                          />
                        )}
                      </TableCell>

                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No leave records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={leaves.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

      <Box sx={{ ml: 3, width: '500px' }}>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <Card sx={{ height: '220px' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Card 1</Typography>
                <Typography>Content for Card 1</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{ height: '220px' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Card 2</Typography>
                <Typography>Content for Card 2</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{ height: '220px' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Card 3</Typography>
                <Typography>Content for Card 3</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{ height: '220px' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Card 4</Typography>
                <Typography>Content for Card 4</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LeaveManagement;


