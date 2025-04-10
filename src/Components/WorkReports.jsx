import React, { useState, useEffect } from "react";
import {
  Container, TextField, Button, Typography, Snackbar, Select, MenuItem,
  Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, FormControl,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Grid, Card, CardContent, Chip
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const WorkReports = () => {
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({
    date: "",
    tasks: "",
    hoursWorked: "",
    status: "Pending",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [filter, setFilter] = useState("All");
  const [openDialog, setOpenDialog] = useState(false);
  const employeeId = localStorage.getItem("userEmployeeId");

  useEffect(() => {
    if (!employeeId) return;
    fetch(`http://localhost:5000/api/reports?employeeId=${employeeId}`)
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error("Fetch error:", err));
  }, [employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newReport,
          employeeId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setReports([...reports, { ...newReport, id: data.id }]);
        setNewReport({ date: "", tasks: "", hoursWorked: "", status: "Pending" });
        setOpenSnackbar(true);
        setOpenDialog(false);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const filteredReports = filter === "All" ? reports : reports.filter((r) => r.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        My Work Reports
      </Typography>

      <Grid container spacing={3} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => {
              setNewReport({ date: "", tasks: "", hoursWorked: "", status: "Pending" });
              setOpenDialog(true);
            }}
          >
            Add Report
          </Button>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Status Filter</InputLabel>
            <Select value={filter} onChange={(e) => setFilter(e.target.value)} label="Status Filter">
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Tasks</TableCell>
              <TableCell>Hours Worked</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{new Date(report.date).toLocaleDateString("en-GB")}</TableCell>
                <TableCell>{report.tasks}</TableCell>
                <TableCell>{report.hoursWorked}</TableCell>
                <TableCell>
                  <Chip label={report.status} color={getStatusColor(report.status)} />
                </TableCell>
              </TableRow>
            ))}
            {filteredReports.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary Cards
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6">Total Reports</Typography>
              <Typography variant="h4" color="primary">{reports.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6">Completed Reports</Typography>
              <Typography variant="h4" color="success.main">
                {reports.filter((r) => r.status === "Completed").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6">Pending/In Progress</Typography>
              <Typography variant="h4" color="warning.main">
                {reports.filter((r) => r.status !== "Completed").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid> */}

      {/* Add Report Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Report</DialogTitle>
        <DialogContent>
          <TextField
            label="Date"
            type="date"
            fullWidth
            margin="dense"
            value={newReport.date}
            onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Tasks Worked-on"
            multiline
            rows={3}
            fullWidth
            margin="dense"
            value={newReport.tasks}
            onChange={(e) => setNewReport({ ...newReport, tasks: e.target.value })}
            required
          />
          <TextField
            label="Hours Worked"
            type="number"
            fullWidth
            margin="dense"
            value={newReport.hoursWorked}
            onChange={(e) => setNewReport({ ...newReport, hoursWorked: e.target.value })}
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={newReport.status}
              onChange={(e) => setNewReport({ ...newReport, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Report saved successfully!"
      />
    </Container>
  );
};

export default WorkReports;



