import React from "react";
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const Attendance = () => {
  const attendanceRecords = [
    { id: 1, employee: "John Doe", date: "2025-05-01", status: "Present" },
    { id: 2, employee: "Jane Smith", date: "2025-05-01", status: "Absent" },
    { id: 3, employee: "Emma Brown", date: "2025-05-01", status: "Present" },
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Attendance
      </Typography>
      <Box sx={{ mt: 2 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceRecords.map((attendance) => (
                <TableRow key={attendance.id}>
                  <TableCell>{attendance.employee}</TableCell>
                  <TableCell>{attendance.date}</TableCell>
                  <TableCell>{attendance.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Attendance;
