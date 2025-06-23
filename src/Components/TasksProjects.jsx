// import React, { useState, useEffect } from 'react';
// import {
//   Box, Button, TextField, Table, TableContainer, TableHead, TableRow, TableCell, TableBody,
//   Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
//   FormControl, InputLabel, Select, MenuItem, Autocomplete, Chip, Avatar, FormControlLabel, Checkbox,
//   Tabs, Tab
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
//   const [tab, setTab] = useState(0); 
//   const [tasks, setTasks] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [dialogType, setDialogType] = useState('task');
//   const [users, setEmployees] = useState([]);
//   const [newItemField, setNewItemField] = useState({
//     name: '',
//     description: '',
//     dueDate: '',
//     startDate: '',
//     endDate: '',
//     assignedEmployees: [],
//     createdBy: '',
//     status: '',
//     isRecurring: true
//   });
//   const [filterStatus, setFilterStatus] = useState('All');

//   const companyName = localStorage.getItem('companyName');
//   const token = localStorage.getItem('id');

//   // Function to check if today is Monday
//   const is23rd = () => {
//     const today = new Date();
//     return today.getDate() === 23;
//   };

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/users/employees', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { companyName },
//       });
//       setEmployees(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/tasks', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { companyName },
//       });
//       setTasks(response.data);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     }
//   };

//   const fetchProjects = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/projects', {
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
//     const { name, value, type, checked } = e.target;
//     setNewItemField((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleCreateOrUpdate = async () => {
//     if (
//       newItemField.name &&
//       newItemField.description &&
//       (dialogType === 'task' ? newItemField.dueDate : newItemField.startDate) &&
//       newItemField.assignedEmployees.length > 0 &&
//       newItemField.createdBy
//     ) {
//       try {
//         const itemData = {
//           companyName,
//           name: newItemField.name,
//           description: newItemField.description,
//           createdBy: newItemField.createdBy,
//           employeeIds: newItemField.assignedEmployees,
//           status: newItemField.status,
//           isRecurring: newItemField.isRecurring,
//           ...(dialogType === 'task' ? { dueDate: newItemField.dueDate } : { startDate: newItemField.startDate, endDate: newItemField.endDate }),
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

//         setNewItemField({
//           name: '',
//           description: '',
//           dueDate: '',
//           startDate: '',
//           endDate: '',
//           assignedEmployees: [],
//           createdBy: '',
//           status: 'Pending',
//           isRecurring: false
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
//     setNewItemField({
//       name: item.name,
//       description: item.description,
//       dueDate: formatDateForInput(item.dueDate),
//       startDate: formatDateForInput(item.startDate),
//       endDate: formatDateForInput(item.endDate),
//       assignedEmployees: item.assignedEmployees || [],
//       createdBy: item.createdBy,
//       status: item.status,
//       isRecurring: item.isRecurring || false
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
//       alert(error.response?.data?.error || 'An error occurred while deleting.');
//     }
//   };

//   const handleOpenDialog = (type) => {
//     setDialogType(type);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setEditId(null);
//     setNewItemField({
//       name: '',
//       description: '',
//       dueDate: '',
//       startDate: '',
//       endDate: '',
//       assignedEmployees: [],
//       createdBy: '',
//       status: 'Pending',
//       isRecurring: false
//     });
//   };

//   const filteredItems = (items) => {
//     let filtered = filterStatus === 'All' ? items : items.filter((item) => item.status === filterStatus);
//     if (!is23rd()) {
//       filtered = filtered.filter((item) => !item.isRecurring);
//     }
//     return filtered;
//   };

//   const getUserDisplayName = (employeeId) => {
//     const user = users.find((u) => u.employeeId === employeeId);
//     return user ? `${user.firstName} ${user.lastName}` : `Unknown (${employeeId})`;
//   };

//   const getUserById = (employeeId) => {
//     return users.find((u) => u.employeeId === employeeId) || { employeeId, firstName: 'Unknown', lastName: '' };
//   };

//   const handleTabChange = (event, newValue) => {
//     setTab(newValue);
//   };

//   return (
//     <Box sx={{ p: 5 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//         <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
//           Tasks and Projects {is23rd() ? '(Including Recurring Tasks)' : '(Non-Recurring Tasks Only)'}
//         </Typography>
//         <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
//           {tab === 0 && (
//             <Button
//               variant="contained"
//               size="small"
//               onClick={() => handleOpenDialog('task')}
//             >
//               Assign Task
//             </Button>
//           )}
//           {tab === 1 && (
//             <Button
//               variant="contained"
//               size="small"
//               onClick={() => handleOpenDialog('project')}
//             >
//               Create Project
//             </Button>
//           )}
//         </Box>
//       </Box>

//       <Tabs value={tab} onChange={handleTabChange} aria-label="tasks and projects tabs">
//         <Tab label="Tasks" />
//         <Tab label="Projects" />
//       </Tabs>

//       {tab === 0 && (
//         <>
//           <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Tasks</Typography>
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell><strong>Task Name</strong></TableCell>
//                   <TableCell><strong>Description</strong></TableCell>
//                   <TableCell><strong>Due Date</strong></TableCell>
//                   <TableCell><strong>Assigned Employees</strong></TableCell>
//                   <TableCell><strong>Created By</strong></TableCell>
//                   <TableCell><strong>Status</strong></TableCell>
//                   <TableCell><strong>Recurring</strong></TableCell>
//                   <TableCell><strong>Actions</strong></TableCell>
//                   <TableCell></TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredItems(tasks).map((task) => {
//                   const assignedUsers = task.assignedEmployees.map((employeeId) =>
//                     getUserById(employeeId)
//                   );
//                   const createdByUser = getUserById(task.createdBy);
//                   return (
//                     <TableRow key={task.id}>
//                       <TableCell>{task.name}</TableCell>
//                       <TableCell>{task.description}</TableCell>
//                       <TableCell>{formatDateForDisplay(task.dueDate)}</TableCell>
//                       <TableCell>
//                         {assignedUsers.map((user) => (
//                           <Chip
//                             variant="outlined"
//                             key={user.employeeId}
//                             avatar={<Avatar src={user.photo || undefined} />}
//                             label={`${user.firstName} ${user.lastName}`}
//                             sx={{ m: 0.5 }}
//                           />
//                         ))}
//                       </TableCell>
//                       <TableCell sx={{ fontSize: '10px' }}>
//                         <Chip
//                           variant="outlined"
//                           avatar={<Avatar src={createdByUser.photo || undefined} />}
//                           label={`${createdByUser.firstName} ${createdByUser.lastName}`}
//                           sx={{ m: 0.5 }}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={task.status}
//                           color={
//                             task.status === 'Pending' ? 'default' :
//                             task.status === 'In Progress' ? 'primary' :
//                             'success'
//                           }
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={task.isRecurring ? 'Recurring' : 'Non-Recurring'}
//                           color={task.isRecurring ? 'info' : 'default'}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Button variant="outlined" size="small" onClick={() => handleEdit(task, 'task')}>
//                           Edit
//                         </Button>
//                       </TableCell>
//                       <TableCell>
//                         <IconButton onClick={() => handleDelete(task.id, 'task')}>
//                           <DeleteIcon sx={{ color: 'red' }} />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </>
//       )}

//       {tab === 1 && (
//         <>
//           <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Projects</Typography>
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell><strong>Project Name</strong></TableCell>
//                   <TableCell><strong>Description</strong></TableCell>
//                   <TableCell><strong>Start Date</strong></TableCell>
//                   <TableCell><strong>End Date</strong></TableCell>
//                   <TableCell><strong>Assigned Employees</strong></TableCell>
//                   <TableCell><strong>Created By</strong></TableCell>
//                   <TableCell><strong>Status</strong></TableCell>
//                   <TableCell><strong>Actions</strong></TableCell>
//                   <TableCell></TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredItems(projects).map((project) => {
//                   const assignedUsers = project.assignedEmployees.map((employeeId) =>
//                     getUserById(employeeId)
//                   );
//                   const createdByUser = getUserById(project.createdBy);
//                   return (
//                     <TableRow key={project.id}>
//                       <TableCell>{project.name}</TableCell>
//                       <TableCell>{project.description}</TableCell>
//                       <TableCell>{formatDateForDisplay(project.startDate)}</TableCell>
//                       <TableCell>{formatDateForDisplay(project.endDate)}</TableCell>
//                       <TableCell>
//                         {assignedUsers.map((user) => (
//                           <Chip
//                             variant="outlined"
//                             key={user.employeeId}
//                             avatar={<Avatar src={user.photo || undefined} />}
//                             label={`${user.firstName} ${user.lastName}`}
//                             sx={{ m: 0.5 }}
//                           />
//                         ))}
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           variant="outlined"
//                           avatar={<Avatar src={createdByUser.photo || undefined} />}
//                           label={`${createdByUser.firstName} ${createdByUser.lastName}`}
//                           sx={{ m: 0.5 }}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={project.status}
//                           color={
//                             project.status === 'Pending' ? 'default' :
//                             project.status === 'In Progress' ? 'primary' :
//                             'success'
//                           }
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Button variant="outlined" size="small" onClick={() => handleEdit(project, 'project')}>
//                           Edit
//                         </Button>
//                       </TableCell>
//                       <TableCell>
//                         <IconButton onClick={() => handleDelete(project.id, 'project')}>
//                           <DeleteIcon sx={{ color: 'red' }} />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </>
//       )}

//       <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
//         <DialogTitle>{editId ? `Edit ${dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}` : `Create New ${dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}`}</DialogTitle>
//         <DialogContent dividers>
//           <TextField
//             fullWidth
//             label="Name"
//             name="name"
//             value={newItemField.name}
//             onChange={handleInputChange}
//             margin="normal"
//             required
//           />
//           <TextField
//             fullWidth
//             label="Description"
//             name="description"
//             value={newItemField.description}
//             onChange={handleInputChange}
//             margin="normal"
//             multiline
//             rows={4}
//             required
//           />
//           {dialogType === 'task' ? (
//             <>
//               <TextField
//                 fullWidth
//                 label="Due Date"
//                 name="dueDate"
//                 type="date"
//                 value={newItemField.dueDate}
//                 onChange={handleInputChange}
//                 margin="normal"
//                 InputLabelProps={{ shrink: true }}
//                 required
//               />
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={newItemField.isRecurring}
//                     onChange={handleInputChange}
//                     name="isRecurring"
//                   />
//                 }
//                 label="Recurring Task (Every 23rd of the Month)"
//                 sx={{ mt: 2 }}
//               />
//             </>
//           ) : (
//             <>
//               <TextField
//                 fullWidth
//                 label="Start Date"
//                 name="startDate"
//                 type="date"
//                 value={newItemField.startDate}
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
//                 value={newItemField.endDate}
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
//             value={managers.find((user) => user.employeeId === newItemField.createdBy) || null}
//             onChange={(event, newValue) => {
//               setNewItemField((prev) => ({
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
//                       <strong>Name:</strong> {option.firstName} ${option.lastName}
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
//                   avatar={<Avatar src={value.photo || undefined} />}
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
//             value={nonManagers.filter((user) => newItemField.assignedEmployees.includes(user.employeeId))}
//             onChange={(event, newValue) => {
//               setNewItemField((prev) => ({
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
//                       <strong>Name:</strong> {option.firstName} ${option.lastName}
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
//                   avatar={<Avatar src={option.photo || undefined} />}
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
  FormControl, InputLabel, Select, MenuItem, Autocomplete, Chip, Avatar, FormControlLabel, Checkbox,
  Tabs, Tab
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
  const [tab, setTab] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState(null);
  const [dialogType, setDialogType] = useState('task');
  const [users, setEmployees] = useState([]);
  const [newItemField, setNewItemField] = useState({
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
  const token = localStorage.getItem('id');

  const is23rd = () => new Date().getDate() === 23;

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/employees', {
        headers: { Authorization: `Bearer ${token}` },
        params: { companyName },
      });
      setEmployees(response.data);
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
    setNewItemField((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateOrUpdate = async () => {
    if (
      newItemField.name &&
      newItemField.description &&
      (dialogType === 'task' ? newItemField.dueDate : newItemField.startDate) &&
      newItemField.assignedEmployees.length > 0 &&
      newItemField.createdBy
    ) {
      try {
        const itemData = {
          companyName,
          name: newItemField.name,
          description: newItemField.description,
          createdBy: newItemField.createdBy,
          employeeIds: newItemField.assignedEmployees,
          status: newItemField.status,
          isRecurring: newItemField.isRecurring,
          ...(dialogType === 'task' ? { dueDate: newItemField.dueDate } : { startDate: newItemField.startDate, endDate: newItemField.endDate }),
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

        setNewItemField({
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
    setNewItemField({
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
    setNewItemField({
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

  const filteredItems = (items) => {
    let filtered = filterStatus === 'All' ? items : items.filter((item) => item.status === filterStatus);
    if (!is23rd()) {
      filtered = filtered.filter((item) => !item.isRecurring);
    }
    return filtered;
  };

  const getUserDisplayName = (employeeId) => {
    const user = users.find((u) => u.employeeId === employeeId);
    return user ? `${user.firstName} ${user.lastName}` : `Unknown (${employeeId})`;
  };

  const getUserById = (employeeId) => {
    return users.find((u) => u.employeeId === employeeId) || { employeeId, firstName: 'Unknown', lastName: '' };
  };

  const handleTabChange = (event, newValue) => setTab(newValue);

  return (
    <Box sx={{ p: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Tasks and Projects {is23rd() ? '(Including Recurring Tasks)' : '(Non-Recurring Tasks Only)'}
        </Typography>
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
          {tab === 0 && (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleOpenDialog('task')}
            >
              Assign Task
            </Button>
          )}
          {tab === 1 && (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleOpenDialog('project')}
            >
              Create Project
            </Button>
          )}
        </Box>
      </Box>

      <Tabs value={tab} onChange={handleTabChange} aria-label="tasks and projects tabs">
        <Tab label="Tasks" />
        <Tab label="Projects" />
      </Tabs>

      {tab === 0 && (
        <>
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
                  const assignedUsers = task.assignedEmployees?.map((employeeId) => getUserById(employeeId)) || [];
                  const createdByUser = getUserById(task.createdBy);
                  return (
                    <TableRow key={task.id}>
                      <TableCell>{task.name}</TableCell>
                      <TableCell>{task.description}</TableCell>
                      <TableCell>{formatDateForDisplay(task.dueDate)}</TableCell>
                      <TableCell>
                        {assignedUsers.map((user) => (
                          <Chip
                            variant="outlined"
                            key={user.employeeId}
                            avatar={<Avatar src={user.photo || undefined} />}
                            label={`${user.firstName} ${user.lastName}`}
                            sx={{ m: 0.5 }}
                          />
                        ))}
                      </TableCell>
                      <TableCell>
                        <Chip
                          variant="outlined"
                          avatar={<Avatar src={createdByUser.photo || undefined} />}
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
        </>
      )}

      {tab === 1 && (
        <>
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
                  const assignedUsers = project.assignedEmployees?.map((employeeId) => getUserById(employeeId)) || [];
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
                            avatar={<Avatar src={user.photo || undefined} />}
                            label={`${user.firstName} ${user.lastName}`}
                            sx={{ m: 0.5 }}
                          />
                        ))}
                      </TableCell>
                      <TableCell>
                        <Chip
                          variant="outlined"
                          avatar={<Avatar src={createdByUser.photo || undefined} />}
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
        </>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? `Edit ${dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}` : `Create New ${dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}`}</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={newItemField.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={newItemField.description}
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
                value={newItemField.dueDate}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newItemField.isRecurring}
                    onChange={handleInputChange}
                    name="isRecurring"
                  />
                }
                label="Recurring Task (Every 23rd of the Month)"
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
                value={newItemField.startDate}
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
                value={newItemField.endDate}
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
            value={managers.find((user) => user.employeeId === newItemField.createdBy) || null}
            onChange={(event, newValue) => {
              setNewItemField((prev) => ({
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
                      <strong>Name:</strong> {option.firstName} ${option.lastName}
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
                  avatar={<Avatar src={value.photo || undefined} />}
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
            value={nonManagers.filter((user) => newItemField.assignedEmployees.includes(user.employeeId))}
            onChange={(event, newValue) => {
              setNewItemField((prev) => ({
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
                  avatar={<Avatar src={option.photo || undefined} />}
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