import React from "react";
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const EmployeesReports = () => {
  const reports = [
    { id: 1, employee: "John Doe", type: "Leave Report", date: "2025-05-01", status: "Approved" },
    { id: 2, employee: "Jane Smith", type: "Attendance Report", date: "2025-05-01", status: "Pending" },
    { id: 3, employee: "Emma Brown", type: "Leave Report", date: "2025-05-02", status: "Denied" },
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <Box sx={{ mt: 2 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Report Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.employee}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default EmployeesReports;
