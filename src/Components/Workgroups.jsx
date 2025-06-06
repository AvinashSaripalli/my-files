// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Avatar,
//   AvatarGroup,
//   Menu,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   IconButton,
//   Button,
//   Grid,
//   TextField,
//   DialogActions,
//   FormControl,
//   InputLabel,
//   Select,
//   Autocomplete,
// } from '@mui/material';
// import axios from 'axios';
// import CloseIcon from '@mui/icons-material/Close';

// const Workgroups = () => {
//   const [workgroups, setWorkgroups] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedEmployees, setSelectedEmployees] = useState([]);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [partnerCompanies, setPartnerCompanies] = useState([]);
//   const [createGroups, setCreateGroups] = useState({
//     partnerCompanyName: '',
//     partnerCompanyId: '',
//     privacyType: '',
//     createdBy: localStorage.getItem('employeeId') || '',
//     employeers: [],
//   });
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [selectedWorkgroupId, setSelectedWorkgroupId] = useState(null);
//   const navigate = useNavigate();

//   // Fetch users (employees)
//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const companyName = localStorage.getItem('companyName');

//       const response = await axios.get('http://localhost:5000/api/users/employees', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { companyName },
//       });
//       setUsers(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   // Fetch workgroups and partner companies (unchanged)
//   const fetchWorkGroups = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const companyName = localStorage.getItem('companyName');

//       const response = await axios.get('http://localhost:5000/api/workgroups', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { companyName },
//       });
//       setWorkgroups(response.data);
//     } catch (error) {
//       console.error('Error fetching workgroups:', error);
//     }
//   };

//   const fetchPartnerCompanies = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get('http://localhost:5000/api/workgroups/partners', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPartnerCompanies(response.data);
//     } catch (error) {
//       console.error('Error fetching partner companies:', error);
//     }
//   };

//   useEffect(() => {
//     fetchWorkGroups();
//     fetchPartnerCompanies();
//   }, []);

//   useEffect(() => {
//     if (openDialog) {
//       fetchUsers();
//     }
//   }, [openDialog]);

//   // Filter users by role
//   const managers = users.filter((user) => user.role === 'Manager');
//   const nonManagers = users.filter((user) => user.role !== 'Manager');

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCreateGroups((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePartnerCompanyChange = (event, newValue) => {
//     setCreateGroups((prev) => ({
//       ...prev,
//       partnerCompanyName: newValue ? newValue.partnerCompanyName : '',
//       partnerCompanyId: newValue ? newValue.partnerCompanyId : '',
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const companyName = localStorage.getItem('companyName');
//       const workgroupsData = {
//         companyName,
//         partnerCompanyName: createGroups.partnerCompanyName,
//         partnerCompanyId: createGroups.partnerCompanyId,
//         privacyType: createGroups.privacyType,
//         createdBy: createGroups.createdBy,
//         employeeIds: createGroups.employeers,
//       };

//       if (isEditMode) {
//         await axios.put(`http://localhost:5000/api/workgroups/${selectedWorkgroupId}`, workgroupsData, {
//           headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//         });
//       } else {
//         await axios.post('http://localhost:5000/api/workgroups', workgroupsData, {
//           headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//         });
//       }

//       setOpenDialog(false);
//       setIsEditMode(false);
//       setSelectedWorkgroupId(null);
//       setCreateGroups({
//         partnerCompanyName: '',
//         partnerCompanyId: '',
//         privacyType: '',
//         createdBy: localStorage.getItem('employeeId') || '',
//         employeers: [],
//       });
//       fetchWorkGroups();
//     } catch (error) {
//       console.error(`Error ${isEditMode ? 'updating' : 'creating'} workgroup:`, error);
//     }
//   };

//   const handleEditClick = (group) => {
//     setIsEditMode(true);
//     setSelectedWorkgroupId(group.id);
//     setCreateGroups({
//       partnerCompanyName: group.partnerCompanyName,
//       partnerCompanyId: group.partnerCompanyId,
//       privacyType: group.privacyType,
//       createdBy: group.createdBy,
//       employeers: group.employees.map((emp) => emp.employeeId),
//     });
//     setOpenDialog(true);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedEmployees([]);
//   };

//   const handleDialogClose = () => {
//     setOpenDialog(false);
//     setIsEditMode(false);
//     setSelectedWorkgroupId(null);
//     setCreateGroups({
//       partnerCompanyName: '',
//       partnerCompanyId: '',
//       privacyType: '',
//       createdBy: localStorage.getItem('employeeId') || '',
//       employeers: [],
//     });
//   };

//   // Group workgroups for display (unchanged)
//   const groupedWorkgroups = workgroups.reduce((acc, workgroup) => {
//     const { id, partnerCompanyName, partnerCompanyId, createdBy, createdOn, privacyType, employeeId } = workgroup;
//     if (!acc[id]) {
//       acc[id] = {
//         id,
//         companyName: workgroup.companyName,
//         partnerCompanyName,
//         partnerCompanyId,
//         createdOn,
//         privacyType,
//         createdBy,
//         createdByName: `${workgroup.firstName || ''} ${workgroup.lastName || ''}`.trim() || createdBy,
//         employees: new Map(),
//       };
//     }
//     if (employeeId && !acc[id].employees.has(employeeId)) {
//       acc[id].employees.set(employeeId, {
//         employeeId,
//         firstName: workgroup.firstName,
//         lastName: workgroup.lastName,
//         email: workgroup.email,
//         designation: workgroup.designation,
//         department: workgroup.department,
//         technicalSkills: workgroup.technicalSkills,
//         photo: workgroup.photo,
//       });
//     }
//     return acc;
//   }, {});

//   const groupedData = Object.values(groupedWorkgroups).map((data) => ({
//     id: data.id,
//     companyName: data.companyName,
//     partnerCompanyName: data.partnerCompanyName,
//     partnerCompanyId: data.partnerCompanyId,
//     createdOn: data.createdOn,
//     privacyType: data.privacyType,
//     createdBy: data.createdBy,
//     createdByName: data.createdByName,
//     employees: Array.from(data.employees.values()),
//   }));

//   return (
//     <Box sx={{ pl: 6, pr: 6, mt: '50px' }}>
//       <Grid container spacing={3} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
//         <Typography variant="h5" sx={{ fontWeight: 'bold' }} align="center" gutterBottom>
//           Work Groups
//         </Typography>
//         <Grid>
//           <Button
//             variant="outlined"
//             color="primary"
//             onClick={() => {
//               setIsEditMode(false);
//               setOpenDialog(true);
//             }}
//           >
//             Add WorkGroups
//           </Button>
//         </Grid>
//       </Grid>
//       <TableContainer
//         component={Paper}
//         sx={{
//           maxHeight: '462px',
//           overflowY: 'auto',
//           boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 12px',
//         }}
//       >
//         <Table stickyHeader aria-label="workgroups table">
//           <TableHead sx={{ backgroundColor: '#f4f7fe', height: '80px' }}>
//             <TableRow>
//               <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
//                 Partner Company ID
//               </TableCell>
//               {/* <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
//                 ID
//               </TableCell> */}
//               <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
//                 Partner Company
//               </TableCell>
//               {/* <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
//                 Partner Company ID
//               </TableCell> */}
//               <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
//                 Created By
//               </TableCell>
//               <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
//                 Date Created
//               </TableCell>
//               <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
//                 Privacy Type
//               </TableCell>
//               <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
//                 Employees
//               </TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {groupedData.length > 0 ? (
//               groupedData.map((group) => (
//                 <TableRow key={group.id}>
//                   <TableCell align="center">{group.partnerCompanyId}</TableCell>
//                   {/* <TableCell align="center">{group.id}</TableCell> */}
//                   {/* <TableCell align="left">{group.partnerCompanyName}</TableCell> */}
//                   <TableCell align="left">
//                     <Link
//                       to={`/tasks/${group.partnerCompanyId}`}
//                       sx={{
//                         textDecoration: 'none',
//                         color: '#1976d2',
//                         '&:hover': { textDecoration: 'underline' },
//                       }}
//                     >
//                       {group.partnerCompanyName}
//                     </Link>
//                   </TableCell>
//                   {/* <TableCell align="center">{group.partnerCompanyId}</TableCell> */}
//                   <TableCell align="center">{group.createdByName}</TableCell>
//                   <TableCell align="center">
//                     {new Date(group.createdOn).toLocaleDateString('en-GB')}
//                   </TableCell>
//                   <TableCell align="center">
//                     <Chip label={group.privacyType} style={{ width: '100px', minWidth: 'unset' }} />
//                   </TableCell>
//                   <TableCell align="center">
//                     <AvatarGroup
//                       max={3}
//                       sx={{ justifyContent: 'center', cursor: 'pointer' }}
//                       onClick={(event) => handleAvatarGroupClick(event, group.employees)}
//                     >
//                       {group.employees.map((emp) => (
//                         <Avatar
//                           key={emp.employeeId}
//                           src={emp.photo ? `http://localhost:5000${emp.photo}` : undefined}
//                           alt={`${emp.firstName} ${emp.lastName}`}
//                           sx={{ width: 40, height: 40 }}
//                           title={emp.employeeId}
//                         />
//                       ))}
//                     </AvatarGroup>
//                   </TableCell>
//                   <TableCell>
//                     <Button
//                       variant="contained"
//                       size="small"
//                       onClick={() => handleEditClick(group)}
//                     >
//                       Edit
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={8} align="center">
//                   No workgroups found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//         PaperProps={{
//           sx: { maxHeight: '400px', width: '400px' },
//         }}
//       >
//         {selectedEmployees.map((emp) => (
//           <MenuItem
//             key={emp.employeeId}
//             onClick={() => {
//               setSelectedEmployeeDetails(emp);
//               setDialogOpen(true);
//               handleMenuClose();
//             }}
//           >
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               <Avatar
//                 src={emp.photo ? `http://localhost:5000${emp.photo}` : undefined}
//                 alt={`${emp.firstName} ${emp.lastName}`}
//                 sx={{ width: 40, height: 40 }}
//               />
//               <Box>
//                 <Typography variant="body2">
//                   <strong>ID:</strong> {emp.employeeId}
//                 </Typography>
//                 <Typography variant="body2">
//                   <strong>Name:</strong> {emp.firstName} {emp.lastName}
//                 </Typography>
//                 <Typography variant="body2">
//                   <strong>Email:</strong> {emp.email}
//                 </Typography>
//               </Box>
//             </Box>
//           </MenuItem>
//         ))}
//       </Menu>
//       <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           Employee Details
//           <IconButton
//             color="inherit"
//             onClick={() => setDialogOpen(false)}
//             aria-label="close"
//             sx={{ position: 'absolute', right: 8, top: 14 }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers>
//           {selectedEmployeeDetails && (
//             <Box sx={{ display: 'flex', gap: 2 }}>
//               <Avatar
//                 src={selectedEmployeeDetails.photo ? `http://localhost:5000${selectedEmployeeDetails.photo}` : undefined}
//                 alt={`${selectedEmployeeDetails.firstName} ${selectedEmployeeDetails.lastName}`}
//                 sx={{ width: 80, height: 80 }}
//               />
//               <Box>
//                 <Typography variant="body1">
//                   <strong>ID:</strong> {selectedEmployeeDetails.employeeId}
//                 </Typography>
//                 <Typography variant="body1">
//                   <strong>Name:</strong> {selectedEmployeeDetails.firstName} {selectedEmployeeDetails.lastName}
//                 </Typography>
//                 <Typography variant="body1">
//                   <strong>Email:</strong> {selectedEmployeeDetails.email}
//                 </Typography>
//                 <Typography variant="body1">
//                   <strong>Designation:</strong> {selectedEmployeeDetails.designation}
//                 </Typography>
//                 <Typography variant="body1">
//                   <strong>Department:</strong> {selectedEmployeeDetails.department}
//                 </Typography>
//                 <Typography variant="body1">
//                   <strong>Skills:</strong>
//                 </Typography>
//                 <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
//                   {(selectedEmployeeDetails.technicalSkills || '')
//                     .split(',')
//                     .map((skill) => skill.trim())
//                     .filter(Boolean)
//                     .map((skill, idx) => (
//                       <Chip key={idx} label={skill} />
//                     ))}
//                 </Box>
//               </Box>
//             </Box>
//           )}
//         </DialogContent>
//       </Dialog>
//       <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
//         <DialogTitle>{isEditMode ? 'Edit WorkGroup' : 'Add WorkGroups'}</DialogTitle>
//         <DialogContent dividers>
//           <Autocomplete
//             options={partnerCompanies}
//             getOptionLabel={(option) => option.partnerCompanyName}
//             value={partnerCompanies.find((pc) => pc.partnerCompanyId === createGroups.partnerCompanyId) || null}
//             onChange={handlePartnerCompanyChange}
//             renderInput={(params) => (
//               <TextField {...params} label="Partner Company" margin="normal" fullWidth />
//             )}
//             renderOption={(props, option) => (
//               <li {...props} key={option.partnerCompanyId}>
//                 <Typography>
//                   {option.partnerCompanyName}
//                 </Typography>
//               </li>
//             )}
//           />
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Privacy Type</InputLabel>
//             <Select
//               name="privacyType"
//               value={createGroups.privacyType}
//               onChange={handleChange}
//               label="Privacy Type"
//             >
//               <MenuItem value="Public">Public</MenuItem>
//               <MenuItem value="Private">Private</MenuItem>
//             </Select>
//           </FormControl>
//           <Autocomplete
//             options={managers}
//             getOptionLabel={(option) => `${option.employeeId}`}
//             value={managers.find((manager) => manager.employeeId === createGroups.createdBy) || null}
//             onChange={(event, newValue) => {
//               setCreateGroups((prev) => ({
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
//                       <strong>Department:</strong> {option.department}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </li>
//             )}
//             sx={{ width: '100%', mt: 2 }}
//           />
//           <Autocomplete
//             multiple
//             id="add-employees"
//             options={nonManagers}
//             getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.employeeId})`}
//             value={nonManagers.filter((user) => createGroups.employeers.includes(user.employeeId))}
//             onChange={(event, newValue) => {
//               setCreateGroups((prev) => ({
//                 ...prev,
//                 employeers: newValue.map((user) => user.employeeId),
//               }));
//             }}
//             filterSelectedOptions
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Add Employees"
//                 margin="normal"
//                 fullWidth
//                 placeholder="Add employees..."
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
//                       <strong>Department:</strong> {option.department}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </li>
//             )}
//             renderTags={(value, getTagProps) =>
//               value.map((user, index) => (
//                 <Chip
//                   key={user.employeeId}
//                   avatar={
//                     <Avatar
//                       src={user.photo || undefined}
//                       alt={`${user.firstName} ${user.lastName}`}
//                     />
//                   }
//                   label={user.employeeId}
//                   {...getTagProps({ index })}
//                   sx={{ m: 0.5 }}
//                 />
//               ))
//             }
//             sx={{ width: '100%', mt: 2 }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button variant="contained" onClick={handleSubmit}>
//             {isEditMode ? 'Update' : 'Submit'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Workgroups;  
// 
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Chip,
  Avatar,
  AvatarGroup,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Grid,
  TextField,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
} from '@mui/material';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

const Workgroups = () => {
  const [workgroups, setWorkgroups] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [partnerCompanies, setPartnerCompanies] = useState([]);
  const [createGroups, setCreateGroups] = useState({
    partnerCompanyName: '',
    partnerCompanyId: '',
    privacyType: '',
    createdBy: localStorage.getItem('employeeId') || '',
    employeers: [],
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedWorkgroupId, setSelectedWorkgroupId] = useState(null);
  const navigate = useNavigate();

  // Fetch users (employees)
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

  // Fetch workgroups
  const fetchWorkGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      const companyName = localStorage.getItem('companyName');
      const response = await axios.get('http://localhost:5000/api/workgroups', {
        headers: { Authorization: `Bearer ${token}` },
        params: { companyName },
      });
      setWorkgroups(response.data);
    } catch (error) {
      console.error('Error fetching workgroups:', error);
    }
  };

  // Fetch partner companies
  const fetchPartnerCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/workgroups/partners', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPartnerCompanies(response.data);
    } catch (error) {
      console.error('Error fetching partner companies:', error);
    }
  };

  useEffect(() => {
    fetchWorkGroups();
    fetchPartnerCompanies();
  }, []);

  useEffect(() => {
    if (openDialog) {
      fetchUsers();
    }
  }, [openDialog]);

  // Filter users by role
  const managers = users.filter((user) => user.role === 'Manager');
  const nonManagers = users.filter((user) => user.role !== 'Manager');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateGroups((prev) => ({ ...prev, [name]: value }));
  };

  const handlePartnerCompanyChange = (event, newValue) => {
    setCreateGroups((prev) => ({
      ...prev,
      partnerCompanyName: newValue ? newValue.partnerCompanyName : '',
      partnerCompanyId: newValue ? newValue.partnerCompanyId : '',
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const companyName = localStorage.getItem('companyName');
      const workgroupsData = {
        companyName,
        partnerCompanyName: createGroups.partnerCompanyName,
        partnerCompanyId: createGroups.partnerCompanyId,
        privacyType: createGroups.privacyType,
        createdBy: createGroups.createdBy,
        employeeIds: createGroups.employeers,
      };

      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/workgroups/${selectedWorkgroupId}`, workgroupsData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
      } else {
        await axios.post('http://localhost:5000/api/workgroups', workgroupsData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
      }

      setOpenDialog(false);
      setIsEditMode(false);
      setSelectedWorkgroupId(null);
      setCreateGroups({
        partnerCompanyName: '',
        partnerCompanyId: '',
        privacyType: '',
        createdBy: localStorage.getItem('employeeId') || '',
        employeers: [],
      });
      fetchWorkGroups();
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} workgroup:`, error);
    }
  };

  const handleEditClick = (group) => {
    setIsEditMode(true);
    setSelectedWorkgroupId(group.id);
    setCreateGroups({
      partnerCompanyName: group.partnerCompanyName,
      partnerCompanyId: group.partnerCompanyId,
      privacyType: group.privacyType,
      createdBy: group.createdBy,
      employeers: group.employees.map((emp) => emp.employeeId),
    });
    setOpenDialog(true);
  };

  const handleAvatarGroupClick = (event, employees) => {
    event.stopPropagation(); // Prevent event bubbling
    setAnchorEl(event.currentTarget);
    setSelectedEmployees(employees);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployees([]);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setIsEditMode(false);
    setSelectedWorkgroupId(null);
    setCreateGroups({
      partnerCompanyName: '',
      partnerCompanyId: '',
      privacyType: '',
      createdBy: localStorage.getItem('employeeId') || '',
      employeers: [],
    });
  };

  // Group workgroups for display
  const groupedWorkgroups = workgroups.reduce((acc, workgroup) => {
    const { id, partnerCompanyName, partnerCompanyId, createdBy, createdOn, privacyType, employeeId } = workgroup;
    if (!acc[id]) {
      acc[id] = {
        id,
        companyName: workgroup.companyName,
        partnerCompanyName,
        partnerCompanyId,
        createdOn,
        privacyType,
        createdBy,
        createdByName: `${workgroup.firstName || ''} ${workgroup.lastName || ''}`.trim() || createdBy,
        employees: new Map(),
      };
    }
    if (employeeId && !acc[id].employees.has(employeeId)) {
      acc[id].employees.set(employeeId, {
        employeeId,
        firstName: workgroup.firstName,
        lastName: workgroup.lastName,
        email: workgroup.email,
        designation: workgroup.designation,
        department: workgroup.department,
        technicalSkills: workgroup.technicalSkills,
        photo: workgroup.photo,
      });
    }
    return acc;
  }, {});

  const groupedData = Object.values(groupedWorkgroups).map((data) => ({
    id: data.id,
    companyName: data.companyName,
    partnerCompanyName: data.partnerCompanyName,
    partnerCompanyId: data.partnerCompanyId,
    createdOn: data.createdOn,
    privacyType: data.privacyType,
    createdBy: data.createdBy,
    createdByName: data.createdByName,
    employees: Array.from(data.employees.values()),
  }));

  return (
    <Box sx={{ pl: 6, pr: 6, mt: '50px' }}>
      <Grid container spacing={3} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }} align="center" gutterBottom>
          Work Groups
        </Typography>
        <Grid>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setIsEditMode(false);
              setOpenDialog(true);
            }}
          >
            Add WorkGroups
          </Button>
        </Grid>
      </Grid>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: '462px',
          overflowY: 'auto',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 12px',
        }}
      >
        <Table stickyHeader aria-label="workgroups table">
          <TableHead sx={{ backgroundColor: '#f4f7fe', height: '80px' }}>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
                Partner Company ID
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
                Partner Company
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
                Created By
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
                Date Created
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
                Privacy Type
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
                Employees
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedData.length > 0 ? (
              groupedData.map((group) => (
                <TableRow key={group.id}>
                  <TableCell align="center">{group.partnerCompanyId}</TableCell>
                  <TableCell align="left">
                    <Link
                      to={`/tasks/${group.partnerCompanyId}`}
                      style={{
                        textDecoration: 'none',
                        color: '#1976d2',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      {group.partnerCompanyName}
                    </Link>
                  </TableCell>
                  <TableCell align="center">{group.createdByName}</TableCell>
                  <TableCell align="center">
                    {new Date(group.createdOn).toLocaleDateString('en-GB')}
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={group.privacyType} sx={{ width: '100px', minWidth: 'unset' }} />
                  </TableCell>
                  <TableCell align="center">
                    {group.employees.length > 0 ? (
                      <AvatarGroup
                        max={3}
                        sx={{ justifyContent: 'center', cursor: 'pointer' }}
                        onClick={(event) => handleAvatarGroupClick(event, group.employees)}
                      >
                        {group.employees.map((emp) => (
                          <Avatar
                            key={emp.employeeId}
                            src={emp.photo ? `http://localhost:5000${emp.photo}` : undefined}
                            alt={`${emp.firstName} ${emp.lastName}`}
                            sx={{ width: 40, height: 40 }}
                            title={`${emp.firstName} ${emp.lastName}`}
                          />
                        ))}
                      </AvatarGroup>
                    ) : (
                      <Typography>No Employees</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleEditClick(group)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No workgroups found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { maxHeight: '400px', width: '400px' },
        }}
      >
        {selectedEmployees.length > 0 ? (
          selectedEmployees.map((emp) => (
            <MenuItem
              key={emp.employeeId}
              onClick={() => {
                setSelectedEmployeeDetails(emp);
                setDialogOpen(true);
                handleMenuClose();
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={emp.photo ? `http://localhost:5000${emp.photo}` : undefined}
                  alt={`${emp.firstName} ${emp.lastName}`}
                  sx={{ width: 40, height: 40 }}
                />
                <Box>
                  <Typography variant="body2">
                    <strong>ID:</strong> {emp.employeeId}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Name:</strong> {emp.firstName} {emp.lastName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {emp.email}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No employees available</MenuItem>
        )}
      </Menu>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Employee Details
          <IconButton
            color="inherit"
            onClick={() => setDialogOpen(false)}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 14 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedEmployeeDetails && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar
                src={selectedEmployeeDetails.photo ? `http://localhost:5000${selectedEmployeeDetails.photo}` : undefined}
                alt={`${selectedEmployeeDetails.firstName} ${selectedEmployeeDetails.lastName}`}
                sx={{ width: 80, height: 80 }}
              />
              <Box>
                <Typography variant="body1">
                  <strong>ID:</strong> {selectedEmployeeDetails.employeeId}
                </Typography>
                <Typography variant="body1">
                  <strong>Name:</strong> {selectedEmployeeDetails.firstName} {selectedEmployeeDetails.lastName}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {selectedEmployeeDetails.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Designation:</strong> {selectedEmployeeDetails.designation}
                </Typography>
                <Typography variant="body1">
                  <strong>Department:</strong> {selectedEmployeeDetails.department}
                </Typography>
                <Typography variant="body1">
                  <strong>Skills:</strong>
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                  {(selectedEmployeeDetails.technicalSkills || '')
                    .split(',')
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                    .map((skill, idx) => (
                      <Chip key={idx} label={skill} />
                    ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEditMode ? 'Edit WorkGroup' : 'Add WorkGroups'}</DialogTitle>
        <DialogContent dividers>
          <Autocomplete
            options={partnerCompanies}
            getOptionLabel={(option) => option.partnerCompanyName}
            value={partnerCompanies.find((pc) => pc.partnerCompanyId === createGroups.partnerCompanyId) || null}
            onChange={handlePartnerCompanyChange}
            renderInput={(params) => (
              <TextField {...params} label="Partner Company" margin="normal" fullWidth />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.partnerCompanyId}>
                <Typography>
                  {option.partnerCompanyName}
                </Typography>
              </li>
            )}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Privacy Type</InputLabel>
            <Select
              name="privacyType"
              value={createGroups.privacyType}
              onChange={handleChange}
              label="Privacy Type"
            >
              <MenuItem value="Public">Public</MenuItem>
              <MenuItem value="Private">Private</MenuItem>
            </Select>
          </FormControl>
          <Autocomplete
            options={managers}
            getOptionLabel={(option) => `${option.employeeId}`}
            value={managers.find((manager) => manager.employeeId === createGroups.createdBy) || null}
            onChange={(event, newValue) => {
              setCreateGroups((prev) => ({
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
            multiple
            id="add-employees"
            options={nonManagers}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.employeeId})`}
            value={nonManagers.filter((user) => createGroups.employeers.includes(user.employeeId))}
            onChange={(event, newValue) => {
              setCreateGroups((prev) => ({
                ...prev,
                employeers: newValue.map((user) => user.employeeId),
              }));
            }}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add Employees"
                margin="normal"
                fullWidth
                placeholder="Add employees..."
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
            renderTags={(value, getTagProps) =>
              value.map((user, index) => (
                <Chip
                  key={user.employeeId}
                  avatar={
                    <Avatar
                      src={user.photo || undefined}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                  }
                  label={user.employeeId}
                  {...getTagProps({ index })}
                  sx={{ m: 0.5 }}
                />
              ))
            }
            sx={{ width: '100%', mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleSubmit}>
            {isEditMode ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Workgroups;  