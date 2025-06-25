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
} from '@mui/material';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

const EmployeeWorkgroups = () => {
  const [workgroups, setWorkgroups] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const navigate = useNavigate();

  const fetchWorkGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      const companyName = localStorage.getItem('companyName');
      const employeeId = localStorage.getItem('userEmployeeId');

      if (!companyName || !employeeId) {
        console.error('Missing companyName or employeeId');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/workgroups/employeeId', {
        headers: { Authorization: `Bearer ${token}` },
        params: { companyName, employeeId },
      });
      setWorkgroups(response.data);
    } catch (error) {
      console.error('Error fetching workgroups:', error);
    }
  };

  useEffect(() => {
    fetchWorkGroups();
  }, []);

  const handleAvatarGroupClick = (event, employees) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedEmployees(employees);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployees([]);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedEmployeeDetails(null);
  };

  const groupedWorkgroups = workgroups.reduce((acc, workgroup) => {
    const {
      id,
      partnerCompanyName,
      partnerCompanyId,
      createdBy,
      createdOn,
      privacyType,
      employeeId,
      createdByFirstName,
      createdByPhoto,
      createdByLastName,
    } = workgroup;
    if (!acc[id]) {
      acc[id] = {
        id,
        companyName: workgroup.companyName,
        partnerCompanyName,
        partnerCompanyId,
        createdOn,
        privacyType,
        createdBy,
        createdByName: `${createdByFirstName || ''} ${createdByLastName || ''}`.trim() || createdBy,
        createdByPhoto,
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
    createdByPhoto: data.createdByPhoto,
    employees: Array.from(data.employees.values()),
  }));

  return (
    <Box sx={{ pl: 6, pr: 6, mt: '50px' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }} align="center" gutterBottom>
        Work Groups
      </Typography>
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
                      state={{
                        partnerCompanyName: group.partnerCompanyName,
                        partnerCompanyId: group.partnerCompanyId,
                      }}
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
                  <TableCell align="center">
                    <Chip
                      variant="outlined"
                      avatar={
                        <Avatar
                          alt={group.createdByName}
                          src={group.createdByPhoto ? `http://localhost:5000${group.createdByPhoto}` : undefined}
                        />
                      }
                      label={group.createdByName}
                      sx={{ fontWeight: 'medium' }}
                    />
                  </TableCell>
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
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
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Employee Details
          <IconButton
            color="inherit"
            onClick={handleDialogClose}
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
    </Box>
  );
};

export default EmployeeWorkgroups;