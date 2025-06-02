// import React, { useState } from 'react';
// import {
//   Box, Button, TextField, MenuItem, Select, InputLabel, FormControl, Table, TableContainer,
//   TableHead, TableRow, TableCell, TableBody, Paper, Typography, Dialog, DialogTitle,
//   DialogContent, DialogActions, IconButton
// } from '@mui/material';
// import { Delete as DeleteIcon } from '@mui/icons-material';

// // Sample data
// const sampleEmployees = [
//   { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
//   { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
//   { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com' },
// ];

// const initialTasks = [
//   {
//     id: 1,
//     name: 'Develop Login Page',
//     description: 'Create a responsive login page with authentication.',
//     dueDate: '2025-06-05',
//     assignedEmployee: 'John Doe',
//     status: 'In Progress',
//     priority: 'High',
//   },
//   // ... other tasks
// ];

// const TasksProjects = () => {
//   const [tasks, setTasks] = useState(initialTasks);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [editTaskId, setEditTaskId] = useState(null);
//   const [newTask, setNewTask] = useState({
//     name: '',
//     description: '',
//     dueDate: '',
//     assignedEmployee: '',
//     status: 'Pending',
//     priority: 'Medium',
//   });
//   const [filterStatus, setFilterStatus] = useState('All');

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewTask((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCreateOrUpdateTask = () => {
//     if (newTask.name && newTask.description && newTask.dueDate && newTask.assignedEmployee) {
//       if (editTaskId) {
//         // Update existing task
//         setTasks(tasks.map((task) =>
//           task.id === editTaskId ? { ...newTask, id: editTaskId } : task
//         ));
//         setEditTaskId(null);
//       } else {
//         // Create new task
//         setTasks([...tasks, { id: tasks.length + 1, ...newTask }]);
//       }
//       setNewTask({
//         name: '',
//         description: '',
//         dueDate: '',
//         assignedEmployee: '',
//         status: 'Pending',
//         priority: 'Medium',
//       });
//       setOpenDialog(false);
//     } else {
//       alert('Please fill in all required fields.');
//     }
//   };

//   const handleEditTask = (task) => {
//     setEditTaskId(task.id);
//     setNewTask({ ...task });
//     setOpenDialog(true);
//   };

//   const handleDeleteTask = (taskId) => {
//     setTasks(tasks.filter((task) => task.id !== taskId));
//   };

//   const handleStatusChange = (taskId, newStatus) => {
//     setTasks(tasks.map((task) =>
//       task.id === taskId ? { ...task, status: newStatus } : task
//     ));
//   };

//   const handleOpenDialog = () => setOpenDialog(true);
//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setEditTaskId(null);
//     setNewTask({
//       name: '',
//       description: '',
//       dueDate: '',
//       assignedEmployee: '',
//       status: 'Pending',
//       priority: 'Medium',
//     });
//   };

//   const filteredTasks = filterStatus === 'All'
//     ? tasks
//     : tasks.filter((task) => task.status === filterStatus);

//   return (
//     <Box sx={{ p: 5 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//         <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Tasks and Projects</Typography>
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <FormControl sx={{ minWidth: 120 }}>
//             <InputLabel>Filter by Status</InputLabel>
//             <Select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               label="Filter by Status"
//             >
//               <MenuItem value="All">All</MenuItem>
//               <MenuItem value="Pending">Pending</MenuItem>
//               <MenuItem value="In Progress">In Progress</MenuItem>
//               <MenuItem value="Completed">Completed</MenuItem>
//             </Select>
//           </FormControl>
//           <Button variant="contained" size="small"  onClick={handleOpenDialog}>
//             Create Task
//           </Button>
//         </Box>
//       </Box>

//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         <DialogTitle>{editTaskId ? 'Edit Task' : 'Create New Task'}</DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth
//             label="Task Name"
//             name="name"
//             value={newTask.name}
//             onChange={handleInputChange}
//             margin="normal"
//             required
//           />
//           <TextField
//             fullWidth
//             label="Description"
//             name="description"
//             value={newTask.description}
//             onChange={handleInputChange}
//             margin="normal"
//             multiline
//             rows={4}
//             required
//           />
//           <TextField
//             fullWidth
//             label="Due Date"
//             name="dueDate"
//             type="date"
//             value={newTask.dueDate}
//             onChange={handleInputChange}
//             margin="normal"
//             InputLabelProps={{ shrink: true }}
//             required
//           />
//           <FormControl fullWidth margin="normal" required>
//             <InputLabel>Assign Employee</InputLabel>
//             <Select
//               name="assignedEmployee"
//               value={newTask.assignedEmployee}
//               onChange={handleInputChange}
//               label="Assign Employee"
//             >
//               {sampleEmployees.map((employee) => (
//                 <MenuItem key={employee.id} value={employee.name}>
//                   {employee.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Priority</InputLabel>
//             <Select
//               name="priority"
//               value={newTask.priority}
//               onChange={handleInputChange}
//               label="Priority"
//             >
//               <MenuItem value="Low">Low</MenuItem>
//               <MenuItem value="Medium">Medium</MenuItem>
//               <MenuItem value="High">High</MenuItem>
//             </Select>
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Status</InputLabel>
//             <Select
//               name="status"
//               value={newTask.status}
//               onChange={handleInputChange}
//               label="Status"
//             >
//               <MenuItem value="Pending">Pending</MenuItem>
//               <MenuItem value="In Progress">In Progress</MenuItem>
//               <MenuItem value="Completed">Completed</MenuItem>
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Cancel</Button>
//           <Button onClick={handleCreateOrUpdateTask} variant="contained" color="primary">
//             {editTaskId ? 'Update' : 'Create'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell><strong>Task Name</strong></TableCell>
//               <TableCell><strong>Description</strong></TableCell>
//               <TableCell><strong>Due Date</strong></TableCell>
//               <TableCell><strong>Assigned Employee</strong></TableCell>
//               <TableCell><strong>Priority</strong></TableCell>
//               <TableCell><strong>Status</strong></TableCell>
//               <TableCell><strong>Actions</strong></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredTasks.map((task) => (
//               <TableRow key={task.id}>
//                 <TableCell>{task.name}</TableCell>
//                 <TableCell>{task.description}</TableCell>
//                 <TableCell>{task.dueDate}</TableCell>
//                 <TableCell>{task.assignedEmployee}</TableCell>
//                 <TableCell>{task.priority}</TableCell>
//                 <TableCell>
//                   <Select
//                     value={task.status}
//                     onChange={(e) => handleStatusChange(task.id, e.target.value)}
//                     size="small"
//                   >
//                     <MenuItem value="Pending">Pending</MenuItem>
//                     <MenuItem value="In Progress">In Progress</MenuItem>
//                     <MenuItem value="Completed">Completed</MenuItem>
//                   </Select>
//                 </TableCell>
//                 <TableCell>
//                   <Button variant="outlined" size='small' onClick={() => handleEditTask(task)}>
//                     Edit
//                   </Button>
//                   <IconButton onClick={() => handleDeleteTask(task.id)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default TasksProjects;

import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Table, TableContainer, TableHead, TableRow, TableCell, TableBody,
  Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  FormControl, InputLabel, Select, MenuItem, Autocomplete, Chip, Avatar
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const TasksProjects = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: 'Develop Login Page',
      description: 'Create a responsive login page with authentication.',
      dueDate: '2025-06-05',
      assignedEmployee: 'john.doe@example.com',
      createdBy: 'manager1@example.com',
      status: 'In Progress',
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    dueDate: '',
    assignedEmployee: '',
    createdBy: '',
  });
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const companyName = localStorage.getItem('companyName');

      const response = await axios.get('http://localhost:5000/api/users/employees', {
        headers: { Authorization: `Bearer ${token}` },
        params: { companyName },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    if (openDialog) {
      fetchUsers();
    }
  }, [openDialog]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdateTask = async () => {
    if (newTask.name && newTask.description && newTask.dueDate && newTask.assignedEmployee && newTask.createdBy) {
      try {
        const token = localStorage.getItem('token');
        const taskData = {
          name: newTask.name,
          description: newTask.description,
          dueDate: newTask.dueDate,
          assignedEmployee: newTask.assignedEmployee,
          createdBy: newTask.createdBy,
          status: 'Pending', // Default status for new tasks
        };

        if (editTaskId) {
          // Update existing task
          setTasks(tasks.map((task) =>
            task.id === editTaskId ? { ...taskData, id: editTaskId, status: task.status } : task
          ));
        } else {
          // Create new task
          setTasks([...tasks, { id: tasks.length + 1, ...taskData }]);
        }

        setNewTask({
          name: '',
          description: '',
          dueDate: '',
          assignedEmployee: '',
          createdBy: '',
        });
        setEditTaskId(null);
        setOpenDialog(false);
      } catch (error) {
        console.error(`Error ${editTaskId ? 'updating' : 'creating'} task:`, error);
        alert('An error occurred while saving the task.');
      }
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const handleEditTask = (task) => {
    setEditTaskId(task.id);
    setNewTask({
      name: task.name,
      description: task.description,
      dueDate: task.dueDate,
      assignedEmployee: task.assignedEmployee,
      createdBy: task.createdBy,
    });
    setOpenDialog(true);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditTaskId(null);
    setNewTask({
      name: '',
      description: '',
      dueDate: '',
      assignedEmployee: '',
      createdBy: '',
    });
  };

  const filteredTasks = filterStatus === 'All'
    ? tasks
    : tasks.filter((task) => task.status === filterStatus);

  return (
    <Box sx={{ p: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Tasks and Projects</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Filter by Status"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" size='small' startIcon={<AddIcon />} onClick={handleOpenDialog}>
            Assign Task
          </Button>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editTaskId ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Task Name"
            name="name"
            value={newTask.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={newTask.description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={4}
            required
          />
          <TextField
            fullWidth
            label="Due Date"
            name="dueDate"
            type="date"
            value={newTask.dueDate}
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <Autocomplete
            id="assign-employee"
            options={users}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.email})`}
            value={users.find((user) => user.email === newTask.assignedEmployee) || null}
            onChange={(event, newValue) => {
              setNewTask((prev) => ({
                ...prev,
                assignedEmployee: newValue ? newValue.email : '',
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assign Employee"
                margin="normal"
                fullWidth
                required
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.email}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={option.photo || undefined}
                    alt={`${option.firstName} ${option.lastName}`}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>

                    <Typography variant="body2">
                      <strong>Name:</strong> {option.firstName} {option.lastName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {option.email}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Department:</strong> {option.department}
                    </Typography>
                  </Box>
                </Box>
              </li>
            )}
            renderTags={(value, getTagProps) =>
              value ? (
                <Chip
                  avatar={
                    <Avatar
                      src={value.photo || undefined}
                      alt={`${value.firstName} ${value.lastName}`}
                    />
                  }
                  label={`${value.firstName} ${value.lastName}`}
                  {...getTagProps({ index: 0 })}
                  sx={{ m: 0.5 }}
                />
              ) : null
            }
            sx={{ width: '100%', mt: 2 }}
          />
          <Autocomplete
            id="created-by"
            options={users.filter((user) => user.role === 'Manager')}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.email})`}
            value={users.find((user) => user.email === newTask.createdBy) || null}
            onChange={(event, newValue) => {
              setNewTask((prev) => ({
                ...prev,
                createdBy: newValue ? newValue.email : '',
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Created By"
                margin="normal"
                fullWidth
                required
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.email}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={option.photo || undefined}
                    alt={`${option.firstName} ${option.lastName}`}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <Typography variant="body2">
                      <strong>Name:</strong> {option.firstName} {option.lastName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {option.email}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Department:</strong> {option.department}
                    </Typography>
                  </Box>
                </Box>
              </li>
            )}
            renderTags={(value, getTagProps) =>
              value ? (
                <Chip
                  avatar={
                    <Avatar
                      src={value.photo || undefined}
                      alt={`${value.firstName} ${value.lastName}`}
                    />
                  }
                  label={`${value.firstName} ${value.lastName}`}
                  {...getTagProps({ index: 0 })}
                  sx={{ m: 0.5 }}
                />
              ) : null
            }
            sx={{ width: '100%', mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreateOrUpdateTask} variant="contained" color="primary">
            {editTaskId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Task Name</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Due Date</strong></TableCell>
              <TableCell><strong>Assigned Employee</strong></TableCell>
              <TableCell><strong>Created By</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.map((task) => {
              const assignedUser = users.find((user) => user.email === task.assignedEmployee) || {};
              const createdByUser = users.find((user) => user.email === task.createdBy) || {};
              return (
                <TableRow key={task.id}>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>
                    {assignedUser.firstName
                      ? `${assignedUser.firstName} ${assignedUser.lastName}`
                      : task.assignedEmployee}
                  </TableCell>
                  <TableCell>
                    {createdByUser.firstName
                      ? `${createdByUser.firstName} ${createdByUser.lastName}`
                      : task.createdBy}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      size="small"
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handleEditTask(task)}>
                      Edit
                    </Button>
                    <IconButton onClick={() => handleDeleteTask(task.id)}>
                      <DeleteIcon  sx={{ color: 'red' }}/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TasksProjects;