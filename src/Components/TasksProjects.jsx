// import React, { useState, useEffect } from 'react';
// import {
//   Box, Button, TextField, Table, TableContainer, TableHead, TableRow, TableCell, TableBody,
//   Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
//   FormControl, InputLabel, Select, MenuItem, Autocomplete, Chip, Avatar
// } from '@mui/material';
// import { Delete as DeleteIcon } from '@mui/icons-material';
// import axios from 'axios';

// const formatDateForInput = (date) => {
//   if (!date) return '';
//   try {
//     const d = new Date(date);
//     if (isNaN(d.getTime())) return '';
//     return d.toISOString().split('T')[0];
//   } catch {
//     return '';
//   }
// };

// const formatDateForDisplay = (date) => {
//   if (!date) return 'N/A';
//   try {
//     const d = new Date(date);
//     if (isNaN(d.getTime())) return 'N/A';
//     return d.toLocaleDateString('en-GB');
//   } catch {
//     return 'N/A';
//   }
// };

// const TasksProjects = () => {
//   const [tasks, setTasks] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [dialogType, setDialogType] = useState('task');
//   const [users, setUsers] = useState([]);
//   const [newItem, setNewItem] = useState({
//     name: '',
//     description: '',
//     dueDate: '',
//     startDate: '',
//     endDate: '',
//     assignedEmployees: [],
//     createdBy: '',
//     status: 'Pending'
//   });
//   const [filterStatus, setFilterStatus] = useState('All');
//   // const [filterEmployeeId, setFilterEmployeeId] = useState('');

//   const companyName = localStorage.getItem('companyName');
//   const token = localStorage.getItem('token');

 
//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/users/employees', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { companyName },
//       });
//       setUsers(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };


//   const fetchTasks = async (employeeId = '') => {
//     try {
//       const url = employeeId
//         ? `http://localhost:5000/api/tasks/employee/${employeeId}`
//         : 'http://localhost:5000/api/tasks';
//       const response = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { companyName },
//       });
//       setTasks(response.data);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     }
//   };

 
//   const fetchProjects = async (employeeId = '') => {
//     try {
//       const url = employeeId
//         ? `http://localhost:5000/api/projects/employee/${employeeId}`
//         : 'http://localhost:5000/api/projects';
//       const response = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { companyName },
//       });
//       setProjects(response.data);
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//     fetchProjects();
//     fetchUsers();
//   }, []);

//   const managers = users.filter((user) => user.role === 'Manager');
//   const nonManagers = users.filter((user) => user.role !== 'Manager');

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewItem((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCreateOrUpdate = async () => {
//     if (
//       newItem.name &&
//       newItem.description &&
//       (dialogType === 'task' ? newItem.dueDate : newItem.startDate) &&
//       newItem.assignedEmployees.length > 0 &&
//       newItem.createdBy
//     ) {
//       try {
//         const itemData = {
//           companyName,
//           name: newItem.name,
//           description: newItem.description,
//           createdBy: newItem.createdBy,
//           employeeIds: newItem.assignedEmployees,
//           status: newItem.status,
//           ...(dialogType === 'task' ? { dueDate: newItem.dueDate } : { startDate: newItem.startDate, endDate: newItem.endDate }),
//         };

//         if (editId) {
//           await axios.put(`http://localhost:5000/api/${dialogType}s/${editId}`, itemData, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//         } else {
//           await axios.post(`http://localhost:5000/api/${dialogType}s`, itemData, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//         }

//         setNewItem({
//           name: '',
//           description: '',
//           dueDate: '',
//           startDate: '',
//           endDate: '',
//           assignedEmployees: [],
//           createdBy: '',
//           status: 'Pending',
//         });
//         setEditId(null);
//         setOpenDialog(false);
//         dialogType === 'task' ? fetchTasks() : fetchProjects();
//       } catch (error) {
//         console.error(`Error ${editId ? 'updating' : 'creating'} ${dialogType}:`, error);
//         alert('An error occurred while saving.');
//       }
//     } else {
//       alert('Please fill in all required fields.');
//     }
//   };

//   const handleEdit = (item, type) => {
//     setEditId(item.id);
//     setDialogType(type);
//     setNewItem({
//       name: item.name,
//       description: item.description,
//       dueDate: formatDateForInput(item.dueDate),
//       startDate: formatDateForInput(item.startDate),
//       endDate: formatDateForInput(item.endDate),
//       assignedEmployees: item.assignedEmployees || [],
//       createdBy: item.createdBy,
//       status: item.status,
//     });
//     setOpenDialog(true);
//   };

//   const handleDelete = async (id, type) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/${type}s/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       type === 'task' ? fetchTasks() : fetchProjects();
//     } catch (error) {
//       console.error(`Error deleting ${type}:`, error);
//       alert('An error occurred while deleting.');
//     }
//   };

//   const handleOpenDialog = (type) => {
//     setDialogType(type);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setEditId(null);
//     setNewItem({
//       name: '',
//       description: '',
//       dueDate: '',
//       startDate: '',
//       endDate: '',
//       assignedEmployees: [],
//       createdBy: '',
//       status: 'Pending',
//     });
//   };

//   const filteredItems = (items) => filterStatus === 'All' ? items : items.filter((item) => item.status === filterStatus);

//   const getUserDisplayName = (employeeId) => {
//     const user = users.find((u) => u.employeeId === employeeId);
//     return user ? `${user.firstName} ${user.lastName}` : `Unknown (${employeeId})`;
//   };

//   const getUserById = (employeeId) => {
//     return users.find((u) => u.employeeId === employeeId) || { employeeId, firstName: 'Unknown', lastName: '' };
//   };

//   return (
//     <Box sx={{ p: 5 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//         <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Tasks and Projects</Typography>
//         <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
//           {/* <Autocomplete
//             options={nonManagers}
//             getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.employeeId})`}
//             value={nonManagers.find((user) => user.employeeId === filterEmployeeId) || null}
//             onChange={(event, newValue) => setFilterEmployeeId(newValue ? newValue.employeeId : '')}
//             renderInput={(params) => <TextField {...params} label="Filter by Employee" />}
//             sx={{ minWidth: 140 }}
//           /> */}
//           <FormControl sx={{ minWidth: 140 }}>
//             <InputLabel>Filter Status</InputLabel>
//             <Select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               label="Filter Status"
//               size="small"
//             >
//               <MenuItem value="All">All</MenuItem>
//               <MenuItem value="Pending">Pending</MenuItem>
//               <MenuItem value="In Progress">In Progress</MenuItem>
//               <MenuItem value="Completed">Completed</MenuItem>
//             </Select>
//           </FormControl>
//           <Button
//             variant="contained"
//             size="small"
//             onClick={() => handleOpenDialog('task')}
//           >
//             Assign Task
//           </Button>
//           <Button
//             variant="contained"
//             size="small"
//             onClick={() => handleOpenDialog('project')}
//           >
//             Create Project
//           </Button>
//         </Box>
//       </Box>

//       <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Tasks</Typography>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell><strong>Task Name</strong></TableCell>
//               <TableCell><strong>Description</strong></TableCell>
//               <TableCell><strong>Due Date</strong></TableCell>
//               <TableCell><strong>Assigned Employees</strong></TableCell>
//               <TableCell><strong>Created By</strong></TableCell>
//               <TableCell><strong>Status</strong></TableCell>
//               <TableCell><strong>Actions</strong></TableCell>
//               <TableCell></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredItems(tasks).map((task) => {
//               const assignedUsers = task.assignedEmployees.map((employeeId) =>
//                 getUserById(employeeId)
//               );
//               const createdByUser = getUserById(task.createdBy);
//               return (
//                 <TableRow key={task.id}>
//                   <TableCell>{task.name}</TableCell>
//                   <TableCell>{task.description}</TableCell>
//                   <TableCell>{formatDateForDisplay(task.dueDate)}</TableCell>
//                   <TableCell>
//                     {assignedUsers.map((user) => (
//                       <Chip
//                         variant="outlined"
//                         key={user.employeeId}
//                         avatar={<Avatar src={user.photo || undefined} alt={`${user.firstName} ${user.lastName}`} />}
//                         label={`${user.firstName} ${user.lastName}`}
//                         sx={{ m: 0.5 }}
//                       />
//                     ))}
//                   </TableCell>
//                   <TableCell>
//                     <Chip
//                       variant="outlined"
//                       avatar={<Avatar src={createdByUser.photo || undefined} alt={`${createdByUser.firstName} ${createdByUser.lastName}`} />}
//                       label={`${createdByUser.firstName} ${createdByUser.lastName}`}
//                       sx={{ m: 0.5 }}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Chip
//                       label={task.status}
//                       color={
//                         task.status === 'Pending' ? 'default' :
//                         task.status === 'In Progress' ? 'primary' :
//                         'success'
//                       }
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Button variant="outlined" size="small" onClick={() => handleEdit(task, 'task')}>
//                       Edit
//                     </Button>
//                   </TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => handleDelete(task.id, 'task')}>
//                       <DeleteIcon sx={{ color: 'red' }} />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Projects</Typography>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell><strong>Project Name</strong></TableCell>
//               <TableCell><strong>Description</strong></TableCell>
//               <TableCell><strong>Start Date</strong></TableCell>
//               <TableCell><strong>End Date</strong></TableCell>
//               <TableCell><strong>Assigned Employees</strong></TableCell>
//               <TableCell><strong>Created By</strong></TableCell>
//               <TableCell><strong>Status</strong></TableCell>
//               <TableCell><strong>Actions</strong></TableCell>
//               <TableCell></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredItems(projects).map((project) => {
//               const assignedUsers = project.assignedEmployees.map((employeeId) =>
//                 getUserById(employeeId)
//               );
//               const createdByUser = getUserById(project.createdBy);
//               return (
//                 <TableRow key={project.id}>
//                   <TableCell>{project.name}</TableCell>
//                   <TableCell>{project.description}</TableCell>
//                   <TableCell>{formatDateForDisplay(project.startDate)}</TableCell>
//                   <TableCell>{formatDateForDisplay(project.endDate)}</TableCell>
//                   <TableCell>
//                     {assignedUsers.map((user) => (
//                       <Chip
//                         variant="outlined"
//                         key={user.employeeId}
//                         avatar={<Avatar src={user.photo || undefined} alt={`${user.firstName} ${user.lastName}`} />}
//                         label={`${user.firstName} ${user.lastName}`}
//                         sx={{ m: 0.5 }}
//                       />
//                     ))}
//                   </TableCell>
//                   <TableCell>
//                     <Chip
//                       variant="outlined"
//                       avatar={<Avatar src={createdByUser.photo || undefined} alt={`${createdByUser.firstName} ${createdByUser.lastName}`} />}
//                       label={`${createdByUser.firstName} ${createdByUser.lastName}`}
//                       sx={{ m: 0.5 }}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Chip
//                       label={project.status}
//                       color={
//                         project.status === 'Pending' ? 'default' :
//                         project.status === 'In Progress' ? 'primary' :
//                         'success'
//                       }
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Button variant="outlined" size="small" onClick={() => handleEdit(project, 'project')}>
//                       Edit
//                     </Button>
//                   </TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => handleDelete(project.id, 'project')}>
//                       <DeleteIcon sx={{ color: 'red' }} />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
//         <DialogTitle>{editId ? `Edit ${dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}` : `Create New ${dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}`}</DialogTitle>
//         <DialogContent dividers>
//           <TextField
//             fullWidth
//             label="Name"
//             name="name"
//             value={newItem.name}
//             onChange={handleInputChange}
//             margin="normal"
//             required
//           />
//           <TextField
//             fullWidth
//             label="Description"
//             name="description"
//             value={newItem.description}
//             onChange={handleInputChange}
//             margin="normal"
//             multiline
//             rows={4}
//             required
//           />
//           {dialogType === 'task' ? (
//             <TextField
//               fullWidth
//               label="Due Date"
//               name="dueDate"
//               type="date"
//               value={newItem.dueDate}
//               onChange={handleInputChange}
//               margin="normal"
//               InputLabelProps={{ shrink: true }}
//               required
//             />
//           ) : (
//             <>
//               <TextField
//                 fullWidth
//                 label="Start Date"
//                 name="startDate"
//                 type="date"
//                 value={newItem.startDate}
//                 onChange={handleInputChange}
//                 margin="normal"
//                 InputLabelProps={{ shrink: true }}
//                 required
//               />
//               <TextField
//                 fullWidth
//                 label="End Date"
//                 name="endDate"
//                 type="date"
//                 value={newItem.endDate}
//                 onChange={handleInputChange}
//                 margin="normal"
//                 InputLabelProps={{ shrink: true }}
//               />
//             </>
//           )}
//           <Autocomplete
//             id="created-by"
//             options={managers}
//             getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
//             value={managers.find((user) => user.employeeId === newItem.createdBy) || null}
//             onChange={(event, newValue) => {
//               setNewItem((prev) => ({
//                 ...prev,
//                 createdBy: newValue ? newValue.employeeId : '',
//               }));
//             }}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Created By"
//                 margin="normal"
//                 fullWidth
//                 required
//                 placeholder="Select a manager..."
//               />
//             )}
//             renderOption={(props, option) => (
//               <li {...props} key={option.employeeId}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                   <Avatar
//                     src={option.photo || undefined}
//                     alt={`${option.firstName} ${option.lastName}`}
//                     sx={{ width: 40, height: 40 }}
//                   />
//                   <Box>
//                     <Typography variant="body2">
//                       <strong>ID:</strong> {option.employeeId}
//                     </Typography>
//                     <Typography variant="body2">
//                       <strong>Name:</strong> {option.firstName} {option.lastName}
//                     </Typography>
//                     <Typography variant="body2">
//                       <strong>Department:</strong> {option.department || 'N/A'}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </li>
//             )}
//             sx={{ width: '100%', mt: 2 }}
//             renderTags={(value) => (
//               value ? (
//                 <Chip
//                   avatar={<Avatar src={value.photo || undefined} alt={`${value.firstName} ${value.lastName}`} />}
//                   label={`${value.firstName} ${value.lastName}`}
//                   sx={{ m: 0.5 }}
//                 />
//               ) : null
//             )}
//           />
//           <Autocomplete
//             multiple
//             id="assign-employees"
//             options={nonManagers}
//             getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
//             value={nonManagers.filter((user) => newItem.assignedEmployees.includes(user.employeeId))}
//             onChange={(event, newValue) => {
//               setNewItem((prev) => ({
//                 ...prev,
//                 assignedEmployees: newValue.map((user) => user.employeeId),
//               }));
//             }}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Assign Employees"
//                 margin="normal"
//                 fullWidth
//                 required
//                 placeholder="Select employees..."
//               />
//             )}
//             renderOption={(props, option) => (
//               <li {...props} key={option.employeeId}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                   <Avatar
//                     src={option.photo || undefined}
//                     alt={`${option.firstName} ${option.lastName}`}
//                     sx={{ width: 40, height: 40 }}
//                   />
//                   <Box>
//                     <Typography variant="body2">
//                       <strong>ID:</strong> {option.employeeId}
//                     </Typography>
//                     <Typography variant="body2">
//                       <strong>Name:</strong> {option.firstName} {option.lastName}
//                     </Typography>
//                     <Typography variant="body2">
//                       <strong>Department:</strong> {option.department || 'N/A'}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </li>
//             )}
//             renderTags={(value, getTagProps) =>
//               value.map((option, index) => (
//                 <Chip
//                   variant="outlined"
//                   key={option.employeeId}
//                   avatar={<Avatar src={option.photo || undefined} alt={`${option.firstName} ${option.lastName}`} />}
//                   label={`${option.firstName} ${option.lastName}`}
//                   {...getTagProps({ index })}
//                   sx={{ m: 0.5 }}
//                 />
//               ))
//             }
//             sx={{ width: '100%', mt: 2 }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="error" variant="contained">Cancel</Button>
//           <Button onClick={handleCreateOrUpdate} variant="contained" color="primary">
//             {editId ? 'Update' : 'Create'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default TasksProjects;

import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Table, TableContainer, TableHead, TableRow, TableCell, TableBody,
  Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  FormControl, InputLabel, Select, MenuItem, Autocomplete, Chip, Avatar, FormControlLabel, Checkbox
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const formatDateForInput = (date) => {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

const formatDateForDisplay = (date) => {
  if (!date) return 'N/A';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-GB');
  } catch {
    return 'N/A';
  }
};

const TasksProjects = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState(null);
  const [dialogType, setDialogType] = useState('task');
  const [users, setUsers] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    dueDate: '',
    startDate: '',
    endDate: '',
    assignedEmployees: [],
    createdBy: '',
    status: 'Pending',
    isRecurring: false
  });
  const [filterStatus, setFilterStatus] = useState('All');

  const companyName = localStorage.getItem('companyName');
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/employees', {
        headers: { Authorization: `Bearer ${token}` },
        params: { companyName },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
        params: { companyName },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
        params: { companyName },
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchUsers();
  }, []);

  const managers = users.filter((user) => user.role === 'Manager');
  const nonManagers = users.filter((user) => user.role !== 'Manager');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateOrUpdate = async () => {
    if (
      newItem.name &&
      newItem.description &&
      (dialogType === 'task' ? newItem.dueDate : newItem.startDate) &&
      newItem.assignedEmployees.length > 0 &&
      newItem.createdBy
    ) {
      try {
        const itemData = {
          companyName,
          name: newItem.name,
          description: newItem.description,
          createdBy: newItem.createdBy,
          employeeIds: newItem.assignedEmployees,
          status: newItem.status,
          isRecurring: newItem.isRecurring,
          ...(dialogType === 'task' ? { dueDate: newItem.dueDate } : { startDate: newItem.startDate, endDate: newItem.endDate }),
        };

        if (editId) {
          await axios.put(`http://localhost:5000/api/${dialogType}s/${editId}`, itemData, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          await axios.post(`http://localhost:5000/api/${dialogType}s`, itemData, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        setNewItem({
          name: '',
          description: '',
          dueDate: '',
          startDate: '',
          endDate: '',
          assignedEmployees: [],
          createdBy: '',
          status: 'Pending',
          isRecurring: false
        });
        setEditId(null);
        setOpenDialog(false);
        dialogType === 'task' ? fetchTasks() : fetchProjects();
      } catch (error) {
        console.error(`Error ${editId ? 'updating' : 'creating'} ${dialogType}:`, error);
        alert('An error occurred while saving.');
      }
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const handleEdit = (item, type) => {
    setEditId(item.id);
    setDialogType(type);
    setNewItem({
      name: item.name,
      description: item.description,
      dueDate: formatDateForInput(item.dueDate),
      startDate: formatDateForInput(item.startDate),
      endDate: formatDateForInput(item.endDate),
      assignedEmployees: item.assignedEmployees || [],
      createdBy: item.createdBy,
      status: item.status,
      isRecurring: item.isRecurring || false
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id, type) => {
    try {
      await axios.delete(`http://localhost:5000/api/${type}s/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      type === 'task' ? fetchTasks() : fetchProjects();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert(error.response?.data?.error || 'An error occurred while deleting.');
    }
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditId(null);
    setNewItem({
      name: '',
      description: '',
      dueDate: '',
      startDate: '',
      endDate: '',
      assignedEmployees: [],
      createdBy: '',
      status: 'Pending',
      isRecurring: false
    });
  };

  const filteredItems = (items) => filterStatus === 'All' ? items : items.filter((item) => item.status === filterStatus);

  const getUserDisplayName = (employeeId) => {
    const user = users.find((u) => u.employeeId === employeeId);
    return user ? `${user.firstName} ${user.lastName}` : `Unknown (${employeeId})`;
  };

  const getUserById = (employeeId) => {
    return users.find((u) => u.employeeId === employeeId) || { employeeId, firstName: 'Unknown', lastName: '' };
  };

  return (
    <Box sx={{ p: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Tasks and Projects</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel>Filter Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Filter Status"
              size="small"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleOpenDialog('task')}
          >
            Assign Task
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleOpenDialog('project')}
          >
            Create Project
          </Button>
        </Box>
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Tasks</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Task Name</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Due Date</strong></TableCell>
              <TableCell><strong>Assigned Employees</strong></TableCell>
              <TableCell><strong>Created By</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Recurring</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems(tasks).map((task) => {
              const assignedUsers = task.assignedEmployees.map((employeeId) =>
                getUserById(employeeId)
              );
              const createdByUser = getUserById(task.createdBy);
              return (
                <TableRow key={task.id} >
                  <TableCell>{task.name} </TableCell>
                  <TableCell>{task.description} </TableCell>
                  <TableCell>{formatDateForDisplay(task.dueDate)}</TableCell>
                  <TableCell>
                    {assignedUsers.map((user) => (
                      <Chip
                        variant="outlined"
                        key={user.employeeId}
                        avatar={<Avatar src={user.photo || undefined} alt={`${user.firstName} ${user.lastName}`} />}
                        label={`${user.firstName} ${user.lastName}`}
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell sx={{fontSize: '10px'}}>
                    <Chip
                      variant="outlined"
                      avatar={<Avatar src={createdByUser.photo || undefined} alt={`${createdByUser.firstName} ${createdByUser.lastName}`} />}
                      label={`${createdByUser.firstName} ${createdByUser.lastName}`}
                      sx={{ m: 0.5 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      color={
                        task.status === 'Pending' ? 'default' :
                        task.status === 'In Progress' ? 'primary' :
                        'success'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.isRecurring ? 'Recurring' : 'Non-Recurring'}
                      color={task.isRecurring ? 'info' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handleEdit(task, 'task')}>
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(task.id, 'task')}>
                      <DeleteIcon sx={{ color: 'red' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Projects</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Project Name</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Start Date</strong></TableCell>
              <TableCell><strong>End Date</strong></TableCell>
              <TableCell><strong>Assigned Employees</strong></TableCell>
              <TableCell><strong>Created By</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems(projects).map((project) => {
              const assignedUsers = project.assignedEmployees.map((employeeId) =>
                getUserById(employeeId)
              );
              const createdByUser = getUserById(project.createdBy);
              return (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{formatDateForDisplay(project.startDate)}</TableCell>
                  <TableCell>{formatDateForDisplay(project.endDate)}</TableCell>
                  <TableCell>
                    {assignedUsers.map((user) => (
                      <Chip
                        variant="outlined"
                        key={user.employeeId}
                        avatar={<Avatar src={user.photo || undefined} alt={`${user.firstName} ${user.lastName}`} />}
                        label={`${user.firstName} ${user.lastName}`}
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip
                      variant="outlined"
                      avatar={<Avatar src={createdByUser.photo || undefined} alt={`${createdByUser.firstName} ${createdByUser.lastName}`} />}
                      label={`${createdByUser.firstName} ${createdByUser.lastName}`}
                      sx={{ m: 0.5 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={project.status}
                      color={
                        project.status === 'Pending' ? 'default' :
                        project.status === 'In Progress' ? 'primary' :
                        'success'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handleEdit(project, 'project')}>
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(project.id, 'project')}>
                      <DeleteIcon sx={{ color: 'red' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? `Edit ${dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}` : `Create New ${dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}`}</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={newItem.description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={4}
            required
          />
          {dialogType === 'task' ? (
            <>
              <TextField
                fullWidth
                label="Due Date"
                name="dueDate"
                type="date"
                value={newItem.dueDate}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newItem.isRecurring}
                    onChange={handleInputChange}
                    name="isRecurring"
                  />
                }
                label="Recurring Task (Every 19th of the Month)"
                sx={{ mt: 2 }}
              />
            </>
          ) : (
            <>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={newItem.startDate}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="date"
                value={newItem.endDate}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </>
          )}
          <Autocomplete
            id="created-by"
            options={managers}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            value={managers.find((user) => user.employeeId === newItem.createdBy) || null}
            onChange={(event, newValue) => {
              setNewItem((prev) => ({
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
                required
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
                      <strong>Name:</strong> {option.firstName} {option.lastName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Department:</strong> {option.department || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </li>
            )}
            sx={{ width: '100%', mt: 2 }}
            renderTags={(value) => (
              value ? (
                <Chip
                  avatar={<Avatar src={value.photo || undefined} alt={`${value.firstName} ${value.lastName}`} />}
                  label={`${value.firstName} ${value.lastName}`}
                  sx={{ m: 0.5 }}
                />
              ) : null
            )}
          />
          <Autocomplete
            multiple
            id="assign-employees"
            options={nonManagers}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            value={nonManagers.filter((user) => newItem.assignedEmployees.includes(user.employeeId))}
            onChange={(event, newValue) => {
              setNewItem((prev) => ({
                ...prev,
                assignedEmployees: newValue.map((user) => user.employeeId),
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assign Employees"
                margin="normal"
                fullWidth
                required
                placeholder="Select employees..."
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
                      <strong>Department:</strong> {option.department || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </li>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  key={option.employeeId}
                  avatar={<Avatar src={option.photo || undefined} alt={`${option.firstName} ${option.lastName}`} />}
                  label={`${option.firstName} ${option.lastName}`}
                  {...getTagProps({ index })}
                  sx={{ m: 0.5 }}
                />
              ))
            }
            sx={{ width: '100%', mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error" variant="contained">Cancel</Button>
          <Button onClick={handleCreateOrUpdate} variant="contained" color="primary">
            {editId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TasksProjects;