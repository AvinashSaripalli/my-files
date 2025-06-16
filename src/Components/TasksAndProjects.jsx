import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Tabs, Tab, Chip, Avatar
} from '@mui/material';
import axios from 'axios';

const TasksAndProjects = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeId = localStorage.getItem('userEmployeeId');
        const companyName = localStorage.getItem('companyName');

        if (!employeeId || !companyName) {
          throw new Error('Employee ID or Company Name not found in local storage');
        }

        const [tasksResponse, projectsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/tasks/employee/${employeeId}`, {
            params: { companyName }
          }),
          axios.get(`http://localhost:5000/api/projects/employee/${employeeId}`, {
            params: { companyName }
          })
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
        Tasks & Projects
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Tasks" />
        <Tab label="Projects" />
      </Tabs>

      {tabValue === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            My Tasks
          </Typography>
          {tasks.length === 0 ? (
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.name}</TableCell>
                      <TableCell>{task.description}</TableCell>
                      <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{task.status}</TableCell>
                      <TableCell>
                        <Chip
                          avatar={<Avatar src={task.createdByPhoto} />}
                          label={`${task.createdByFirstName} ${task.createdByLastName}`}
                        />
                      </TableCell>
                      <TableCell>
                        {task.assignedEmployees && task.assignedEmployees.length > 0 ? (
                          task.assignedEmployees.map(employee => (
                            <Chip
                              key={employee.employeeId}
                              avatar={<Avatar src={employee.photo || ''} />}
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

      {tabValue === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            My Projects
          </Typography>
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
                          avatar={<Avatar src={project.createdByPhoto} />}
                          label={`${project.createdByFirstName} ${project.createdByLastName}`}
                        />
                      </TableCell>
                      <TableCell>
                        {project.assignedEmployees && project.assignedEmployees.length > 0 ? (
                          project.assignedEmployees.map(employee => (
                            <Chip
                              key={employee.employeeId}
                              avatar={<Avatar src={employee.photo || ''} />}
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
    </Box>
  );
};

export default TasksAndProjects;