import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Chip, TablePagination, MenuItem, Tooltip,
  Snackbar, Alert, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText,
  FormControl, InputLabel, Select
} from '@mui/material';
import axios from 'axios';

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5); 
  const [statusFilter, setStatusFilter] = useState('All');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, leaveId: null, status: '' });

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyName = localStorage.getItem("companyName"); 
      
      const response = await axios.get('http://localhost:5000/api/leaves/leave', {
        headers: { Authorization: `Bearer ${token}` },
        params: { companyName },
      });
      setLeaves(response.data);
      setFilteredLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leave data:', error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleUpdateStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put('http://localhost:5000/api/leaves/update-status',
        { leaveId: confirmDialog.leaveId, status: confirmDialog.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({ open: true, message: `Leave ${confirmDialog.status}`, severity: 'success' });
      setConfirmDialog({ open: false, leaveId: null, status: '' });
      fetchLeaves();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error updating leave', severity: 'error' });
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFilter = () => {
    let filtered = [...leaves];
    if (statusFilter !== 'All') {
      filtered = filtered.filter(l => l.status === statusFilter);
    }
    setFilteredLeaves(filtered);
    setPage(0);
  };

  useEffect(() => {
    handleFilter();
  }, [statusFilter, leaves]);

  return (
    <Box sx={{ p: 7 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: { xs: 1, sm: 0 } }}>
          Leave Management
        </Typography>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="status-filter-label">Filter by Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 460, mb: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Employee ID</TableCell>
              <TableCell align='left' sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Leave Type</TableCell>
              <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Start Date</TableCell>
              <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>End Date</TableCell>
              <TableCell align='left' sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Reason</TableCell>
              <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeaves.length > 0 ? (
              filteredLeaves
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((leave, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{leave.employeeId}</TableCell>
                    <TableCell align="left">{leave.leave_type}</TableCell>
                    <TableCell align="center">{new Date(leave.start_date).toLocaleDateString('en-GB')}</TableCell>
                    <TableCell align="center">{new Date(leave.end_date).toLocaleDateString('en-GB')}</TableCell>
                    <TableCell align="left">{leave.reason}</TableCell>
                    <TableCell align="center">
                      {leave.status === 'Pending' ? (
                        <>
                          <Button size="small" color="success" variant="contained" sx={{ mr: 1 }}
                            onClick={() => setConfirmDialog({ open: true, leaveId: leave.id, status: 'Approved' })}>
                            Approve
                          </Button>
                          <Button size="small" color="error" variant="contained"
                            onClick={() => setConfirmDialog({ open: true, leaveId: leave.id, status: 'Rejected' })}>
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Chip label={leave.status} color={
                          leave.status === 'Approved' ? 'success' :
                            leave.status === 'Rejected' ? 'error' : 'warning'
                        } />
                      )}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">No leave records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredLeaves.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, leaveId: null, status: '' })}
      >
        <DialogTitle>Confirm {confirmDialog.status}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {confirmDialog.status.toLowerCase()} this leave request?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, leaveId: null, status: '' })} variant='outlined' >Cancel</Button>
          <Button onClick={handleUpdateStatus} autoFocus variant='outlined' color={confirmDialog.status === 'Approved' ? 'success' : 'error'}>
            Yes, {confirmDialog.status}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageLeaves;
