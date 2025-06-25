import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Tabs, Tab, Chip, Avatar
} from '@mui/material';
import axios from 'axios';
import TaskDialog from './TaskDialog';

const EmployeeTasksProjects = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const is25th = () => new Date().getDate() === 25;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeId = localStorage.getItem('userEmployeeId');
        const companyName = localStorage.getItem('companyName');

        if (!employeeId || !companyName) {
          throw new Error('Employee ID or Company Name not found in local storage');
        }

        const [tasksResponse, projectsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/tasks/employee/${employeeId}`, { params: { companyName } }),
          axios.get(`http://localhost:5000/api/projects/employee/${employeeId}`, { params: { companyName } })
        ]);

        setTasks(tasksResponse.data);
        setProjects(projectsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load tasks and projects. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleDialogClose = (updatedTask) => {
    setDialogOpen(false);
    if (updatedTask && updatedTask.status !== selectedTask?.status) {
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    }
    setSelectedTask(null);
  };

  const filteredTasks = is25th() ? tasks : tasks.filter(task => !task.isRecurring);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Tasks & Projects {is25th() ? '(Including Recurring Tasks)' : '(Non-Recurring Tasks Only)'}
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Tasks" />
        <Tab label="Projects" />
      </Tabs>

      {tabValue === 0 && (
        <Box>
          {/* <Typography variant="h6" gutterBottom>My Tasks</Typography> */}
          {filteredTasks.length === 0 ? (
            <Typography>No tasks assigned to you.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="tasks table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Created By</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Assigned Employees</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Recurring</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      {/* <TableCell
                        onClick={() => handleTaskClick(task)}
                        sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                      >
                        {task.name}
                      </TableCell> */}
                      <TableCell>
                        <Typography
                          onClick={() => handleTaskClick(task)}
                          //component="span"
                          sx={{
                            color: 'black',
                            cursor: 'pointer',
                            '&:hover': {
                              color: 'primary.main',
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {task.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{task.description}</TableCell>
                      <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{task.status}</TableCell>
                      <TableCell>
                        <Chip
                          variant="outlined"
                          avatar={<Avatar src={task.createdByPhoto ? `http://localhost:5000${task.createdByPhoto}` : undefined} />}
                          label={`${task.createdByFirstName} ${task.createdByLastName}`}
                        />
                      </TableCell>
                      <TableCell>
                        {task.assignedEmployees?.length > 0 ? (
                          task.assignedEmployees.map(employee => (
                            <Chip
                              variant="outlined"
                              key={employee.employeeId}
                              avatar={<Avatar src={employee.photo ? `http://localhost:5000${employee.photo}` : undefined } />}
                              label={`${employee.firstName} ${employee.lastName}`}
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))
                        ) : (
                          <Typography variant="body2">None</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.isRecurring ? 'Recurring' : 'Non-Recurring'}
                          color={task.isRecurring ? 'info' : 'default'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          {/* <Typography variant="h6" gutterBottom>My Projects</Typography> */}
          {projects.length === 0 ? (
            <Typography>No projects assigned to you.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="projects table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Created By</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Assigned Employees</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.description}</TableCell>
                      <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}</TableCell>
                      <TableCell>{project.status}</TableCell>
                      <TableCell>
                        <Chip
                          variant="outlined"
                          avatar={<Avatar src={project.createdByPhoto ? `http://localhost:5000${project.createdByPhoto}` : undefined} />}
                          label={`${project.createdByFirstName} ${project.createdByLastName}`}
                        />
                      </TableCell>
                      <TableCell>
                        {project.assignedEmployees?.length > 0 ? (
                          project.assignedEmployees.map(employee => (
                            <Chip
                              variant="outlined"
                              key={employee.employeeId}
                              avatar={<Avatar src={employee.photo ? `http://localhost:5000${employee.photo}` : undefined} />}
                              label={`${employee.firstName} ${employee.lastName}`}
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))
                        ) : (
                          <Typography variant="body2">None</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
      <TaskDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        task={selectedTask || {}}
        companyName={localStorage.getItem('companyName')}
        employeeId={localStorage.getItem('userEmployeeId')}
      />
    </Box>
  );
};

export default EmployeeTasksProjects;