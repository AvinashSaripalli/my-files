import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Chip, CircularProgress, Box, TablePagination
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Attendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchAttendance = async () => {
    const companyName = localStorage.getItem('companyName');
    try {
      const [attendanceRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/attendance', { params: { companyName } }),
        axios.get('http://localhost:5000/api/attendance/stats', { params: { companyName } })
      ]);

      setAttendances(attendanceRes.data);
      setStats(statsRes.data);
      console.log("Fetched data successfully");
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const processChartData = () => {
  return stats.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-GB', {day: 'numeric', month: 'short' }),
    onTime: item.late,    
    late: -item.onTime,   
    total: item.total
  }));
};


  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, px: 2 }}>
      <Box sx={{ maxWidth: 1300, width: '100%' }}>
        <Typography variant="h5" align="left" sx={{ fontWeight: 'bold', mb: 2, color: 'black' }}>
          Attendance
        </Typography>

        {!statsLoading && stats.length > 0 && (
          <Box sx={{ mb: 4, p: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 12px",width:'600px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Attendance Trends (Last 7 Days)</Typography>
            <ResponsiveContainer width={600} height={300}>
              <BarChart
                data={processChartData()}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                stackOffset="sign" 
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                {/* <CartesianGrid strokeOpacity={0.2} /> */}
                <XAxis dataKey="name" fontSize={13} />
                <YAxis fontSize={13}/>
                <Tooltip 
                  cursor={{ fill: "transparent" }}
                  formatter={(value, name) => {
                    if (name === 'Late (> 09:30)') return Math.abs(value);
                    return value;
                  }}
                />
                <Legend />
                <Bar dataKey="onTime" name="Late ClockIn" fill=" #F44336" stackId="a" barSize={35} />
                <Bar dataKey="late" name="Early ClockIn" fill="#4CAF50" stackId="a"  barSize={35}/>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' , boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 12px",}}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ color: '#000', fontWeight: 'bold' }}>Employee ID</TableCell>
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Department</TableCell> 
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>ClockIn_Date</TableCell>
                    <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>ClockIn_Time</TableCell>
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
                        No attendance records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
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