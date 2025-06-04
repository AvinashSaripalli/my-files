import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
} from '@mui/material';
import axios from 'axios';

const Tasks = () => {
  const { partnerCompanyId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    createdBy: localStorage.getItem('employeeId') || '',
  });
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);

  // Fetch tasks for the partner company
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/tasks/getTasks`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { partnerCompanyId },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Fetch employees and managers for assignment
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const companyName = localStorage.getItem('companyName');
      const response = await axios.get('http://localhost:5000/api/users/employees', {
        headers: { Authorization: `Bearer ${token}` },
        params: { companyName },
      });
      setEmployees(response.data);
      setManagers(response.data.filter((user) => user.role === 'Manager'));
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, [partnerCompanyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const taskPayload = {
        ...taskData,
        partnerCompanyId,
      };

      await axios.post('http://localhost:5000/api/tasks/create', taskPayload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      setOpenDialog(false);
      setTaskData({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        createdBy: localStorage.getItem('employeeId') || '',
      });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <Box sx={{ pl: 6, pr: 6, mt: '50px' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }} align="center" gutterBottom>
        Tasks for Partner Company
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 3 }}
      >
        Add Task
      </Button>
      <TableContainer component={Paper} sx={{ maxHeight: '462px', overflowY: 'auto' }}>
        <Table stickyHeader aria-label="tasks table">
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
                  <TableCell align="center">{task.assignedTo}</TableCell>
                  <TableCell align="center">
                    {new Date(task.dueDate).toLocaleDateString('en-GB')}
                  </TableCell>
                  <TableCell align="center">{task.createdBy}</TableCell>
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent dividers>
          <TextField
            name="title"
            label="Task Title"
            value={taskData.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="description"
            label="Description"
            value={taskData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <Autocomplete
            options={employees}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.employeeId})`}
            value={employees.find((emp) => emp.employeeId === taskData.assignedTo) || null}
            onChange={(event, newValue) => {
              setTaskData((prev) => ({
                ...prev,
                assignedTo: newValue ? newValue.employeeId : '',
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assigned To"
                margin="normal"
                fullWidth
                placeholder="Select an employee..."
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.employeeId}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={option.photo || undefined}
                    alt={`${option.firstName} ${option.lastName}`}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <Typography variant="body2">
                      <strong>ID:</strong> {option.employeeId}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Name:</strong> {option.firstName} {option.lastName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Department:</strong> {option.department}
                    </Typography>
                  </Box>
                  </Box>
                </li>
            )}
            sx={{ width: '100%', mt: 2 }}
          />
          <Autocomplete
            options={managers}
            getOptionLabel={(option) => `${option.employeeId}`}
            value={managers.find((manager) => manager.employeeId === taskData.createdBy) || null}
            onChange={(event, newValue) => {
              setTaskData((prev) => ({
                ...prev,
                createdBy: newValue ? newValue.employeeId : '',
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Created By"
                margin="normal"
                fullWidth
                placeholder="Select a manager..."
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.employeeId}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={option.photo || undefined}
                    alt={`${option.firstName} ${option.lastName}`}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <Typography variant="body2">
                      <strong>ID:</strong> {option.employeeId}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Name:</strong> {option.firstName} ${option.lastName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Department:</strong> {option.department}
                    </Typography>
                  </Box>
                  </Box>
                </li>
            )}
            sx={{ width: '100%', mt: 2 }}
          />
          <TextField
            name="dueDate"
            label="Due Date"
            type="date"
            value={taskData.dueDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks;