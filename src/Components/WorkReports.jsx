import React, { useState, useEffect } from "react";
import {
  Container, TextField, Button, Typography, Snackbar, Select, MenuItem,
  Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, FormControl,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Grid, Card, CardContent, Chip, TablePagination
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";


const WorkReports = () => {
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({
    date: "",
    taskName: "",
    workDescription: "",
    hoursWorked: "",
    status: "Pending",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [filter, setFilter] = useState("All");
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const department = localStorage.getItem("userDepartment");
  const employeeId = localStorage.getItem("userEmployeeId");
  const workedTime = localStorage.getItem("workedTime")

  useEffect(() => {
    if (!employeeId) return; 
  
    axios
      .get(`http://localhost:5000/api/reports/getAll?employeeId=${employeeId}`)
      .then((res) => setReports(res.data)) 
      .catch((err) => console.error("Axios GET error:", err));
  }, [employeeId]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workDescriptionArray = newReport.workDescription
    .split("\n")
    .filter((line) => line.trim() !== "");

    try {
      const response = await axios.post("http://localhost:5000/api/reports", {
        ...newReport,
        workDescription: JSON.stringify(workDescriptionArray),
        employeeId,
        department,
      });
    
      setReports([...reports, { ...newReport, id: response.data.id }]);
      setNewReport({ date: "", taskName: "", workDescription:"", hoursWorked: "", status: "Pending" });
      setOpenSnackbar(true);
      setOpenDialog(false);
    } catch (error) {
      console.error("Axios POST error:", error.response?.data || error.message);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedReports = filteredReports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
              const today = new Date().toISOString().split("T")[0]; 
              setNewReport({ date: today, taskName: "",workDescription: "1. ", hoursWorked: "", status: "Pending" });
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

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ color: '#000', fontWeight: 'bold' }}>Date</TableCell>
              <TableCell align="left" sx={{ color: '#000', fontWeight: 'bold' }}>Task Name</TableCell>
              <TableCell align="left" sx={{ color: '#000', fontWeight: 'bold' }}>Work Description</TableCell>
              <TableCell align="center" sx={{ color: '#000', fontWeight: 'bold' }}>Hours Worked</TableCell>
              <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell align="center">{new Date(report.date).toLocaleDateString("en-GB")}</TableCell>
                <TableCell align="left">{report.taskName}</TableCell>
                <TableCell align="left">
                  {Array.isArray(JSON.parse(report.workDescription)) ? (
                    JSON.parse(report.workDescription).map((line, index) => (
                    <Typography key={index} variant="body2">
                      {line}
                    </Typography>
                    ))
                    ) : (
                    <Typography variant="body2">{report.workDescription}</Typography>
                    )}
                </TableCell>

                <TableCell align="center">{report.hoursWorked}</TableCell>
                <TableCell>
                  <Chip label={report.status} color={getStatusColor(report.status)} />
                </TableCell>
              </TableRow>
            ))}
            {paginatedReports.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredReports.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

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
            InputProps={{
              inputProps: {
                min: new Date().toISOString().split("T")[0],
              },
            }}
          />
          <TextField
            label="Task Name"
            fullWidth
            margin="dense"
            value={newReport.taskName}
            onChange={(e) => setNewReport({ ...newReport, taskName: e.target.value })}
            required
          />
          <TextField
            label="Work Description"
            multiline
            rows={5}
            fullWidth
            margin="dense"
            value={newReport.workDescription}
            onChange={(e) => setNewReport({ ...newReport, workDescription: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();

                const lines = newReport.workDescription.split("\n");
                const lastLine = lines[lines.length - 1];
                const match = lastLine.match(/^(\d+)\.\s/);
                let nextNumber = 1;

                if (match) {
                  nextNumber = parseInt(match[1]) + 1;
                } else if (lines.length > 0) {
                  nextNumber = lines.length + 1;
                }

                const newValue = newReport.workDescription + `\n${nextNumber}. `;
                setNewReport({ ...newReport, workDescription: newValue });
              }
            }}
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

