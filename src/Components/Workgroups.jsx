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
} from '@mui/material';
import axios from 'axios';

const Workgroups = () => {
  const [workgroups, setWorkgroups] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

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

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployees([]);
  };

  return (
    <Box sx={{ pl: 6, pr: 6, mt: '30px' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Workgroups
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
          <MenuItem key={emp.employeeId} onClick={handleMenuClose}>
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
    </Box>
  );
};

export default Workgroups;