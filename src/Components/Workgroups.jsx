import React, { useState, useEffect } from 'react';
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
  const [createGroups, setCreateGroups] =useState({
      partnerCompanyName: '',
      createdOn: '',
      privacyType: '',
      employeers: ''
    });


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

  useEffect(() => {
    fetchWorkGroups();
  }, []);
  
  const groupedWorkgroups = workgroups.reduce((acc, workgroup) => {
    const { partnerCompanyName, employeeId } = workgroup;
    if (!acc[partnerCompanyName]) {
      acc[partnerCompanyName] = {
        id: workgroup.id,
        companyName: workgroup.companyName,
        createdOn: workgroup.createdOn,
        privacyType: workgroup.privacyType,
        employees: new Map(),
      };
    }
    if (!acc[partnerCompanyName].employees.has(employeeId)) {
      acc[partnerCompanyName].employees.set(employeeId, {
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

  const groupedData = Object.entries(groupedWorkgroups).map(([partnerCompanyName, data]) => ({
    partnerCompanyName,
    id: data.id,
    companyName: data.companyName,
    createdOn: data.createdOn,
    privacyType: data.privacyType,
    employees: Array.from(data.employees.values()),
  }));

  const handleAvatarGroupClick = (event, employees) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployees(employees);
  };

    const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateGroups((prev) => ({ ...prev, [name]: value }));
  };

    const handleSubmit = async () => {
      const worksgroupsData = new WorkgroupsData();
      worksgroupsData.append("partnerCompanyName", createGroups.partnerCompanyName);
      worksgroupsData.append("createdOn", createGroups.createdOn);
      worksgroupsData.append("privacyType", createGroups.privacyType);
      worksgroupsData.append("employeers", createGroups.employeers);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/workgroups/",
        worksgroupsData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || "Registration failed!", 
        severity: "error" 
      });
    }
  };

  

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployees([]);
  };

  return (
    <Box sx={{ pl: 6, pr: 6, mt: '50px' }}>
      <Grid container spacing={3} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }} align="center" gutterBottom>
          My Work Reports
        </Typography>
        <Grid>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
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
                ID
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
                Partner Company
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
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedData.length > 0 ? (
              groupedData.map((group) => (
                <TableRow key={group.id}>
                  <TableCell align="center">{group.id}</TableCell>
                  <TableCell align="left">{group.partnerCompanyName}</TableCell>
                  <TableCell align="center">
                    {new Date(group.createdOn).toLocaleDateString('en-GB')}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={group.privacyType}
                      style={{ width: '100px', minWidth: 'unset' }}
                    />
                  </TableCell>
                  <TableCell align="center">
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
                          title={emp.employeeId}
                        />
                      ))}
                    </AvatarGroup>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center">
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
        {selectedEmployees.map((emp) => (
          <MenuItem key={emp.employeeId} 
            onClick={() => {
              setSelectedEmployeeDetails(emp);
              setDialogOpen(true);
              handleMenuClose();
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={emp.photo ? `http://localhost:5000${emp.photo}` : undefined}
                alt={`${emp.firstName} ${emp.lastName}`}
                sx={{ width: 40, height: 40 }}
              />
              <Box>
                <Typography variant="body2"><strong>ID:</strong> {emp.employeeId}</Typography>
                <Typography variant="body2"><strong>Name:</strong> {emp.firstName} {emp.lastName}</Typography>
                <Typography variant="body2"><strong>Email:</strong> {emp.email}</Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Menu>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Employee Details
        <IconButton
          color="inherit"
          onClick={() => setDialogOpen(false)}
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
        <DialogContent dividers>
          {selectedEmployeeDetails && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar
                src={selectedEmployeeDetails.photo ? `http://localhost:5000${selectedEmployeeDetails.photo}` : undefined}
                alt={`${selectedEmployeeDetails.firstName} ${selectedEmployeeDetails.lastName}`}
                sx={{ width: 80, height: 80 }}
              />
              <Box>
                <Typography variant="body1"><strong>ID:</strong> {selectedEmployeeDetails.employeeId}</Typography>
                <Typography variant="body1"><strong>Name:</strong> {selectedEmployeeDetails.firstName} {selectedEmployeeDetails.lastName}</Typography>
                <Typography variant="body1"><strong>Email:</strong> {selectedEmployeeDetails.email}</Typography>
                <Typography variant="body1"><strong>Designation:</strong> {selectedEmployeeDetails.designation}</Typography>
                <Typography variant="body1"><strong>Department:</strong> {selectedEmployeeDetails.department}</Typography>
                <Typography variant="body1"><strong>Skills:</strong> </Typography>
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add WorkGroups</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Company Name"
            name="partnerCompanyName"
            margin='normal'
            fullWidth
            value={createGroups.partnerCompanyName}
            onChange={handleChange}
          />
          <TextField
            label="Task Name"
            margin='normal'
            name='taskName'
            fullWidth
            value={createGroups.tasks}
            onChange={handleChange}
          />
          <TextField
            label="Task Description"
            margin='normal'
            name='descriptionTask'
            fullWidth
            rows={4}
            value={createGroups.descriptionTask}
            onChange={handleChange}
          />
          <TextField
            label="Add Employees"
            name="employeers"
            margin='normal'
            fullWidth
            value={createGroups.employeers}
            onChange={handleChange}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Workgroups;