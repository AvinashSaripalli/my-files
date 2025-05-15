import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Chip, CircularProgress, Box, TablePagination
} from '@mui/material';

const Attendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchAttendance = async () => {
    const companyName = localStorage.getItem('companyName');
    try {
      const response = await axios.get('http://localhost:5000/api/attendance', {
        params: { companyName },
      });
      setAttendances(response.data);
      console.log("Fetched attendance Successfully", response.data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, px: 2 }}>
      <Box sx={{ maxWidth: 1300, width: '100%' }}>
        <Typography variant="h5" align="left" sx={{ fontWeight: 'bold', mb: 2, color: 'black' }}>
          Attendance
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ color: '#000', fontWeight: 'bold' }}>Employee ID</TableCell>
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Department</TableCell> 
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Clock_In Date</TableCell>
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Clock_In Time</TableCell>
                    <TableCell align="center" sx={{ color: '#000', fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendances.length > 0 ? (
                    attendances.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((attendance, index) => (
                      <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                        <TableCell align="center">{attendance.employeeId}</TableCell>
                        <TableCell>{attendance.department}</TableCell>
                        <TableCell>{formatDate(attendance.clockInDate)}</TableCell>
                        <TableCell>{attendance.clockInTime}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={attendance.clockInTime ? "Working" : "Not Working"}
                            color={attendance.clockInTime ? "success" : "default"}
                            sx={{ width: "100px", minWidth: "unset" }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No leave records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5]}
              component="div"
              count={attendances.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Attendance;

