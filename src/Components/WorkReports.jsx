// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Snackbar,
//   Select,
//   MenuItem,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   InputLabel,
//   FormControl,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Grid,
//   IconButton,
//   Card,
//   CardContent
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

// const WorkReports = () => {
//   const [reports, setReports] = useState([]);
//   const [newReport, setNewReport] = useState({
//     date: "",
//     tasks: "",
//     hoursWorked: "",
//     status: "Pending",
//   });
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [filter, setFilter] = useState("All");
//   const [editIndex, setEditIndex] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const employeeId = localStorage.getItem("userEmployeeId");

//   useEffect(() => {
//     fetch("http://localhost:5000/api/reports")
//       .then((res) => res.json())
//       .then((data) => setReports(data))
//       .catch((err) => console.error("Fetch error:", err));
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const url =
//       editIndex !== null
//         ? `http://localhost:5000/api/reports/${reports[editIndex].id}`
//         : "http://localhost:5000/api/reports";

//     const method = editIndex !== null ? "PUT" : "POST";

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...newReport,
//           employeeId,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         if (editIndex !== null) {
//           const updated = [...reports];
//           updated[editIndex] = {
//             ...newReport,
//             id: reports[editIndex].id,
//           };
//           setReports(updated);
//           setEditIndex(null);
//         } else {
//           setReports([...reports, { ...newReport, id: data.id }]);
//         }
//         setNewReport({ date: "", tasks: "", hoursWorked: "", status: "Pending" });
//         setOpenSnackbar(true);
//         setOpenDialog(false);
//       } else {
//         console.error(data.error);
//       }
//     } catch (error) {
//       console.error("Submit error:", error);
//     }
//   };

//   const handleEdit = (index) => {
//     setNewReport(reports[index]);
//     setEditIndex(index);
//     setOpenDialog(true);
//   };

//   const handleDelete = async (index) => {
//     const id = reports[index].id;
//     try {
//       const res = await fetch(`http://localhost:5000/api/reports/${id}`, {
//         method: "DELETE",
//       });
//       if (res.ok) {
//         const updated = reports.filter((_, i) => i !== index);
//         setReports(updated);
//       }
//     } catch (error) {
//       console.error("Delete error:", error);
//     }
//   };

//   const filteredReports =
//     filter === "All" ? reports : reports.filter((report) => report.status === filter);

//   return (
//     <Container maxWidth="lg">
//       <Typography variant="h4" gutterBottom align="center">
//         Work Reports
//       </Typography>

// <Card sx={{ mt: 4 }}>
//   <CardContent>
//     <Grid container spacing={2} justifyContent="space-between" alignItems="center">
//       <Grid item>
//         <Button
//           variant="contained"
//           color="primary"
//           startIcon={<AddCircleOutlineIcon />}
//           onClick={() => {
//             setEditIndex(null);
//             setNewReport({ date: "", tasks: "", hoursWorked: "", status: "Pending" });
//             setOpenDialog(true);
//           }}
//         >
//           Add Report
//         </Button>
//       </Grid>
//       <Grid item xs={12} sm={4}>
//         <FormControl fullWidth>
//           <InputLabel>Status Filter</InputLabel>
//           <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
//             <MenuItem value="All">All</MenuItem>
//             <MenuItem value="Pending">Pending</MenuItem>
//             <MenuItem value="In Progress">In Progress</MenuItem>
//             <MenuItem value="Completed">Completed</MenuItem>
//           </Select>
//         </FormControl>
//       </Grid>
//     </Grid>

//     <TableContainer component={Paper} sx={{ mt: 4 }}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Date</TableCell>
//             <TableCell>Tasks</TableCell>
//             <TableCell>Hours Worked</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell align="center">Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {filteredReports.map((report, index) => (
//             <TableRow key={report.id}>
//               <TableCell>{report.date}</TableCell>
//               <TableCell>{report.tasks}</TableCell>
//               <TableCell>{report.hoursWorked}</TableCell>
//               <TableCell>{report.status}</TableCell>
//               <TableCell align="center">
//                 <IconButton color="primary" onClick={() => handleEdit(index)}>
//                   <EditIcon />
//                 </IconButton>
//                 <IconButton color="secondary" onClick={() => handleDelete(index)}>
//                   <DeleteIcon />
//                 </IconButton>
//               </TableCell>
//             </TableRow>
//           ))}
//           {filteredReports.length === 0 && (
//             <TableRow>
//               <TableCell colSpan={5} align="center">
//                 No reports found.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   </CardContent>
// </Card>

// <Grid container spacing={3} sx={{ mt: 2 }}>
//   {/* Card 2 - Summary Stats */}
//   <Grid item xs={12} md={4}>
//     <Card>
//       <CardContent>
//         <Typography variant="h6" gutterBottom>Summary</Typography>
//         <Typography>Total Reports: {reports.length}</Typography>
//         <Typography>
//           Total Hours Worked:{" "}
//           {reports.reduce((sum, r) => sum + parseFloat(r.hoursWorked || 0), 0)}
//         </Typography>
//         <Typography>
//           Completed: {reports.filter((r) => r.status === "Completed").length}
//         </Typography>
//         <Typography>
//           In Progress: {reports.filter((r) => r.status === "In Progress").length}
//         </Typography>
//         <Typography>
//           Pending: {reports.filter((r) => r.status === "Pending").length}
//         </Typography>
//       </CardContent>
//     </Card>
//   </Grid>

//   {/* Card 3 - Recent Reports */}
//   <Grid item xs={12} md={4}>
//     <Card>
//       <CardContent>
//         <Typography variant="h6" gutterBottom>Recent Reports</Typography>
//         {reports.slice(-3).reverse().map((report, index) => (
//           <Typography key={index} variant="body2" sx={{ mb: 1 }}>
//             {report.date} - {report.tasks.slice(0, 30)}... ({report.status})
//           </Typography>
//         ))}
//         {reports.length === 0 && <Typography>No reports available.</Typography>}
//       </CardContent>
//     </Card>
//   </Grid>

//   {/* Card 4 - Status Progress (Bar Visualization) */}
//   <Grid item xs={12} md={4}>
//     <Card>
//       <CardContent>
//         <Typography variant="h6" gutterBottom>Status Distribution</Typography>
//         {["Completed", "In Progress", "Pending"].map((status) => {
//           const count = reports.filter((r) => r.status === status).length;
//           const percentage = reports.length
//             ? Math.round((count / reports.length) * 100)
//             : 0;
//           return (
//             <div key={status} style={{ marginBottom: "10px" }}>
//               <Typography variant="body2">{status}</Typography>
//               <div
//                 style={{
//                   background: "#ddd",
//                   borderRadius: "4px",
//                   height: "10px",
//                   overflow: "hidden",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: `${percentage}%`,
//                     background:
//                       status === "Completed"
//                         ? "#4caf50"
//                         : status === "In Progress"
//                         ? "#ff9800"
//                         : "#f44336",
//                     height: "100%",
//                   }}
//                 />
//               </div>
//               <Typography variant="caption">{percentage}%</Typography>
//             </div>
//           );
//         })}
//       </CardContent>
//     </Card>
//   </Grid>
// </Grid>
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//         <DialogTitle>{editIndex !== null ? "Edit Report" : "Add Report"}</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Date"
//             type="date"
//             fullWidth
//             margin="normal"
//             value={newReport.date}
//             onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
//             InputLabelProps={{ shrink: true }}
//             required
//           />
//           <TextField
//             label="Tasks Completed"
//             multiline
//             rows={3}
//             fullWidth
//             margin="normal"
//             value={newReport.tasks}
//             onChange={(e) => setNewReport({ ...newReport, tasks: e.target.value })}
//             required
//           />
//           <TextField
//             label="Hours Worked"
//             type="number"
//             fullWidth
//             margin="normal"
//             value={newReport.hoursWorked}
//             onChange={(e) => setNewReport({ ...newReport, hoursWorked: e.target.value })}
//             required
//           />
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Status</InputLabel>
//             <Select
//               value={newReport.status}
//               onChange={(e) => setNewReport({ ...newReport, status: e.target.value })}
//             >
//               <MenuItem value="Pending">Pending</MenuItem>
//               <MenuItem value="In Progress">In Progress</MenuItem>
//               <MenuItem value="Completed">Completed</MenuItem>
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} color="primary">
//             {editIndex !== null ? "Update" : "Submit"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={3000}
//         onClose={() => setOpenSnackbar(false)}
//         message="Report saved successfully!"
//       />
//     </Container>
//   );
// };

// export default WorkReports;

import React, { useState, useEffect } from "react";
import {
  Container, TextField, Button, Typography, Snackbar, Select, MenuItem,
  Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, FormControl,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Grid, IconButton, Card, CardContent
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
  const [editIndex, setEditIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const employeeId = localStorage.getItem("userEmployeeId");

  useEffect(() => {
    if (!employeeId) {
      console.error("No employee ID found in localStorage");
      return;
    }

    fetch(`http://localhost:5000/api/reports?employeeId=${employeeId}`)
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error("Fetch error:", err));
  }, [employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url =
      editIndex !== null
        ? `http://localhost:5000/api/reports/${reports[editIndex].id}`
        : "http://localhost:5000/api/reports";

    const method = editIndex !== null ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newReport,
          employeeId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (editIndex !== null) {
          const updated = [...reports];
          updated[editIndex] = { ...newReport, id: reports[editIndex].id };
          setReports(updated);
          setEditIndex(null);
        } else {
          setReports([...reports, { ...newReport, id: data.id }]);
        }
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

  const handleEdit = (index) => {
    setNewReport(reports[index]);
    setEditIndex(index);
    setOpenDialog(true);
  };

  const handleDelete = async (index) => {
    const id = reports[index].id;
    try {
      const res = await fetch(`http://localhost:5000/api/reports/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const updated = reports.filter((_, i) => i !== index);
        setReports(updated);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const filteredReports = filter === "All" ? reports : reports.filter((r) => r.status === filter);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom align="center">
        My Work Reports
      </Typography>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Grid container spacing={2} justifyContent="space-between" alignItems="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => {
                  setEditIndex(null);
                  setNewReport({ date: "", tasks: "", hoursWorked: "", status: "Pending" });
                  setOpenDialog(true);
                }}
              >
                Add Report
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Tasks</TableCell>
                  <TableCell>Hours Worked</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.map((report, index) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.tasks}</TableCell>
                    <TableCell>{report.hoursWorked}</TableCell>
                    <TableCell>{report.status}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleEdit(index)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDelete(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredReports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No reports found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editIndex !== null ? "Edit Report" : "Add Report"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Date"
            type="date"
            fullWidth
            margin="normal"
            value={newReport.date}
            onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Tasks Woked-on"
            multiline
            rows={3}
            fullWidth
            margin="normal"
            value={newReport.tasks}
            onChange={(e) => setNewReport({ ...newReport, tasks: e.target.value })}
            required
          />
          <TextField
            label="Hours Worked"
            type="number"
            fullWidth
            margin="normal"
            value={newReport.hoursWorked}
            onChange={(e) => setNewReport({ ...newReport, hoursWorked: e.target.value })}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={newReport.status}
              onChange={(e) => setNewReport({ ...newReport, status: e.target.value })}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editIndex !== null ? "Update" : "Submit"}
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
