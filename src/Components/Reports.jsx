import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination, IconButton, Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField,InputAdornment } from '@mui/material';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [feedback, setFeedback] = useState(''); 
  const [feedbackError, setFeedbackError] = useState('');

  useEffect(() => {
    const companyName = localStorage.getItem('companyName');
    axios.get('http://localhost:5000/api/reports',{
      params: { companyName }
    })
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
    setFeedback(''); 
    setFeedbackError(''); 
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReport(null);
    setFeedback(''); 
    setFeedbackError(''); 
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
    setFeedbackError(''); 
  };

  const handleFeedbackSubmit = () => {
    if (!feedback.trim()) {
      setFeedbackError('Feedback cannot be empty');
      return;
    }

    axios.put(`http://localhost:5000/api/reports/feedback/${selectedReport.id}`, {
      employeeId: selectedReport.employeeId,
      feedback: feedback.trim(),
    })
      .then(() => {
        alert('Feedback updated successfully!');
        handleCloseDialog(); 
      })
      .catch(() => {
        setFeedbackError('Error updating feedback');
      });
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
    <Box sx={{ pl: 6, pr: 6, mt: '40px' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Daily Work Reports</Typography>
      <TableContainer component={Paper} sx={{
        maxHeight: '462px',
        overflowY: 'auto',
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 12px",
      }}>
        <Table>
          <TableHead sx={{ height: "80px" }}>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Report ID</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Date</TableCell>
              <TableCell align="center"sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Employee ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Task Name</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Hours Worked</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((report, index) => (
                <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' }, height: "70px" }}>
                  <TableCell align="center">{report.id}</TableCell>
                  <TableCell align="center" >{new Date(report.date).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell align="center">{report.employeeId}</TableCell>
                  <TableCell>{report.department}</TableCell>
                  <TableCell>{report.taskName}</TableCell>
                  <TableCell align="center">{report.hoursWorked}</TableCell>
                  <TableCell align="center"><Button variant='contained' size='small' onClick={() => handleViewClick(report)}>View</Button></TableCell>
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
          sx={{
            fontWeight: 'bold',
            fontSize: '20px',
            color: '#000000',
            px: 3,
            py: 2,
            position: 'relative',
          }}
        >
          Report Details
          <IconButton
            onClick={handleCloseDialog}
            aria-label="close"
            sx={{
              position: 'absolute',
              right: 16,
              top: 12,
              color: '#333',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ px: 4, py: 3 }}>
          {selectedReport && (
            <Grid container spacing={3}>
              {[
                { label: 'Employee ID', value: selectedReport.employeeId },
                { label: 'Department', value: selectedReport.department },
                { label: 'Date', value: new Date(selectedReport.date).toLocaleDateString('en-GB') },
                { label: 'Task Name', value: selectedReport.taskName },
                { label: 'Hours Worked', value: selectedReport.hoursWorked },
              ].map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="body1">{item.value}</Typography>
                </Grid>
              ))}

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    display: 'inline-block',
                    backgroundColor:
                      selectedReport.status === 'Completed'
                        ? '#4caf50'
                        : selectedReport.status === 'Pending'
                        ? '#ff9800'
                        : '#9e9e9e',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  }}
                >
                  {selectedReport.status}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Work Description
                </Typography>
                <Box
                  sx={{
                    maxHeight: 200,
                    overflowY: 'auto',
                    backgroundColor: '#f4f7fe',
                    p: 2,
                    borderRadius: 1,
                    border: '1px solid #ddd',
                  }}
                >
                  {Array.isArray(JSON.parse(selectedReport.workDescription)) ? (
                    JSON.parse(selectedReport.workDescription).map((line, index) => (
                      <Typography key={index} variant="body2" gutterBottom>
                        {line}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body2">
                      {selectedReport.workDescription}
                    </Typography>
                  )}
                </Box>
              </Grid>


              {selectedReport.feedback === 'Pending' && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Feedback</Typography>
                  <TextField
                    multiline
                    rows={2}
                    value={feedback}
                    onChange={handleFeedbackChange}
                    placeholder="Enter your feedback here..."
                    error={!!feedbackError}
                    helperText={feedbackError}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleFeedbackSubmit}>
                            <SendIcon color="primary" />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Reports;


