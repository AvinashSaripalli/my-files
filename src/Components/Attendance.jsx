import React from "react";
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { PieChart, Pie, Cell, Legend } from "recharts";

const attendanceRecords = [
  { id: 1, employee: "John Doe", date: "2025-05-01", status: "Present" },
  { id: 2, employee: "Jane Smith", date: "2025-05-01", status: "Absent" },
  { id: 3, employee: "Emma Brown", date: "2025-05-01", status: "Present" }
];

const attendanceData = [
  { name: "Present", value: attendanceRecords.filter(a => a.status === "Present").length },
  { name: "Absent", value: attendanceRecords.filter(a => a.status === "Absent").length }
];

const COLORS = ["#4caf50", "#f44336"];

const Attendance = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Attendance
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4.9 }}>
        <Paper elevation={6} sx={{ flex: 1, borderRadius: 2,boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 12px",  }}>
          <TableContainer >
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
        </Paper>

        <Box sx={{display: 'flex', flexDirection: 'row'}}>
          <Paper elevation={3} sx={{ flex: 1,  borderRadius: 2 ,boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 12px",}}>
            <Typography variant="h6" gutterBottom>
              Attendance Summary
            </Typography>
            <PieChart width={300} height={200}>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="70%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Attendance Records (Card View)
        </Typography>
        <Grid container spacing={3}>
          {attendanceRecords.map((attendance) => (
            <Grid item xs={12} md={4} key={attendance.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{attendance.employee}</Typography>
                  <Typography color="textSecondary">{attendance.date}</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Status: {attendance.status}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Attendance;

