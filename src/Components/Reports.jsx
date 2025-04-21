import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination,IconButton, Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/reports')
      .then((response) => {
        setReports(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching reports');
        setLoading(false);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewClick = (report) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReport(null);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Loading Reports...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pl: 10, pr: 10, mt: '40px' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Work Reports</Typography>
      <TableContainer component={Paper} sx={{
        maxHeight: '462px',
        overflowY: 'auto',
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 12px",
      }}>
        <Table>
          <TableHead sx={{ height:"80px" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Employee ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Task Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Hours Worked</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((report, index) => (
                <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' }, height:"70px" }}>
                  <TableCell>{report.employeeId}</TableCell>
                  <TableCell>{report.department}</TableCell>
                  <TableCell>{new Date(report.date).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell>{report.taskName}</TableCell>
                  <TableCell>{report.hoursWorked}</TableCell>
                  <TableCell>{report.status}</TableCell>
                  <TableCell><Button variant='contained' size='small' onClick={() => handleViewClick(report)}>View</Button></TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        </TableContainer>
      <TablePagination
          component="div"
          count={reports.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
      />
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle
          style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: '20px',
            textAlign: 'left',
            padding: '16px',
          }}
        >
          Report Details
          <IconButton
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
            sx={{
              position: 'absolute',
              right: 8,
              top: 14,
            }}
            >
              <CloseIcon />
          </IconButton>

        </DialogTitle>

          <DialogContent dividers style={{ padding: '24px' }}>
            {selectedReport && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <strong>Employee ID:</strong>
                  <p>{selectedReport.employeeId}</p>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <strong>Department:</strong>
                  <p>{selectedReport.department}</p>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <strong>Date:</strong>
                  <p>{new Date(selectedReport.date).toLocaleDateString('en-GB')}</p>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <strong>Task Name:</strong>
                  <p>{selectedReport.taskName}</p>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <strong>Hours Worked:</strong>
                  <p>{selectedReport.hoursWorked}</p>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <strong>Status:</strong>
                  <p>
                    <span style={{
                      backgroundColor: selectedReport.status === 'Completed' ? '#4caf50' :
                                      selectedReport.status === 'Pending' ? '#ff9800' : '#9e9e9e',
                      color: 'white',
                      padding: '2px 10px',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {selectedReport.status}
                    </span>
                  </p>
                </Grid>
              </Grid>
            )}
          </DialogContent>
      </Dialog>

    </Box>
  );
};

export default Reports;


