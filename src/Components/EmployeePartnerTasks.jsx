import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Avatar,
} from '@mui/material';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EmployeePartnerTasks = () => {
  const { partnerCompanyId: paramPartnerCompanyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  const effectivePartnerCompanyId = location.state?.partnerCompanyId || paramPartnerCompanyId;
  const partnerCompanyName = location.state?.partnerCompanyName || 'Partner Company';

  useEffect(() => {
    console.log('partnerCompanyId from location.state:', location.state?.partnerCompanyId);
    console.log('partnerCompanyId from useParams:', paramPartnerCompanyId);
    console.log('Effective partnerCompanyId:', effectivePartnerCompanyId);
    if (!effectivePartnerCompanyId) {
      console.warn('No partnerCompanyId provided. Redirecting to workgroups.');
      navigate('/employee/work-groups');
    } else {
      fetchTasks();
    }
  }, [effectivePartnerCompanyId, navigate]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const employeeId = localStorage.getItem('userEmployeeId');
      const response = await axios.get(`http://localhost:5000/api/partnerTasks/getPartnerTasks/employee`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          partnerCompanyId: effectivePartnerCompanyId,
          employeeId: employeeId,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching partner tasks:', error);
      alert(`Failed to fetch tasks: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <Box sx={{ pl: 6, pr: 6, mt: '50px' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }} align="center" gutterBottom>
        Tasks for {partnerCompanyName} (ID: {effectivePartnerCompanyId || 'N/A'})
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/employee/work-groups')}
          sx={{ mr: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: '462px', overflowY: 'auto' }}>
        <Table stickyHeader aria-label="partner tasks table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Title</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Assigned To</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Created By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell align="center">{task.title}</TableCell>
                  <TableCell align="center">{task.description}</TableCell>
                  <TableCell align="center">{task.status}</TableCell>
                  <TableCell align="center">
                    <Chip
                      variant="outlined"
                      avatar={
                        <Avatar
                          src={task.assignedToPhoto ? `http://localhost:5000${task.assignedToPhoto}` : undefined}
                          alt={`${task.assignedToFirstName} ${task.assignedToLastName}`}
                        />
                      }
                      label={`${task.assignedToFirstName} ${task.assignedToLastName}`}
                      sx={{ m: 0.5 }}
                    />
                  </TableCell>
                  <TableCell align="center">{new Date(task.dueDate).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell align="center">{`${task.createdByFirstName} ${task.createdByLastName}`}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EmployeePartnerTasks;