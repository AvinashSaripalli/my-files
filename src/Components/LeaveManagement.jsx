import React from "react";
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const LeaveManagement = () => {
  const leaveRequests = [
    { id: 1, employee: "John Doe", leaveType: "Sick Leave", startDate: "2025-05-01", endDate: "2025-05-03", status: "Approved" },
    { id: 2, employee: "Jane Smith", leaveType: "Vacation", startDate: "2025-05-05", endDate: "2025-05-10", status: "Pending" },
    { id: 3, employee: "Emma Brown", leaveType: "Casual Leave", startDate: "2025-05-02", endDate: "2025-05-02", status: "Denied" },
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Leave Management
      </Typography>
      <Box sx={{ mt: 2 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveRequests.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>{leave.employee}</TableCell>
                  <TableCell>{leave.leaveType}</TableCell>
                  <TableCell>{leave.startDate}</TableCell>
                  <TableCell>{leave.endDate}</TableCell>
                  <TableCell>{leave.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default LeaveManagement;
