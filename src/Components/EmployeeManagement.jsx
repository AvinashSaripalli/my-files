import React from "react";
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const EmployeeManagement = () => {
  const employees = [
    { id: 1, name: "John Doe", department: "HR", designation: "Manager", email: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", department: "Finance", designation: "Accountant", email: "jane.smith@example.com" },
    { id: 3, name: "Emma Brown", department: "IT", designation: "Developer", email: "emma.brown@example.com" },
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Employee Management
      </Typography>
      <Box sx={{ mt: 2 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default EmployeeManagement;
