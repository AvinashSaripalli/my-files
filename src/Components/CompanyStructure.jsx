import React, { useEffect, useState } from 'react';
import { OrganizationChart } from 'primereact/organizationchart';
import { Box, Typography,Chip, Drawer } from '@mui/material';
import axios from 'axios';

const CompanyStructure = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

    const handleChipClick = (user) => {
    setSelectedUser(user);
    setDrawerOpen(true);
    };

  useEffect(() => {
    const fetchUsers = async () => {
      const companyName = localStorage.getItem('companyName');
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');

      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          params: { companyName, role },
          headers: { Authorization: `Bearer ${token}` },
        });

        const activeUsers = response.data.filter(user => user.exists === 1);
        setData(transformToOrgStructure(activeUsers));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const transformToOrgStructure = (users) => {
    const departments = {};

    users.forEach(user => {
      const dept = user.department || 'Other';

      if (!departments[dept]) {
        departments[dept] = [];
      }
      
      if (user.role && user.role.toLowerCase() === 'manager') {
        departments[dept].push({
          type: 'person',
          data: {
            photo: user.photo,
            name: `${user.firstName} ${user.lastName}`,
            title: user.role,
          },
        });
      }
    });

    const departmentNodes = Object.keys(departments).map(dept => ({
      type: 'department',
      data: { name: dept },
      expanded: true,
      children: departments[dept],
    }));

    return [{
      type: 'company',
      data: { name: localStorage.getItem('companyName') || 'Company' },
      expanded: true,
      children: departmentNodes,
    }];
  };

  const nodeTemplate = (node) => {
    if (node.type === 'person') {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'white',
            color: 'black',
            borderRadius: 3,
            p: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="body2">
            <img src={node.data.photo} alt="User" width="50" height="50" style={{ borderRadius: '50%' }} />
          </Typography>
          <Typography variant="body2">{node.data.title}</Typography>
          <Typography sx={{ fontWeight: 'bold', mb: 0.5 }}>{node.data.name}</Typography>
            <Chip
            label="employees"
            onClick={() => handleChipClick(node.data)}
            color="primary"
            size="small"
            sx={{ mt: 1 }}
            />
        </Box>
      );
    }

    return (
      <Box
        sx={{
          textAlign: 'center',
          bgcolor: 'white',
          color: 'black',
          borderRadius: 3,
          p: 2,
          boxShadow: 3,
        }}
      >
        <Typography sx={{ fontWeight: 'bold' }}>{node.data.name}</Typography>
      </Box>
    );
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box
      sx={{
        mt: 3,
        p: 2,
        overflowX: 'auto',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
        Company Structure
      </Typography>

      {data.length > 0 ? (
        <Box sx={{ 
          '& .p-organizationchart': {
            width: '100%',
            overflow: 'auto',
          },
          '& .p-organizationchart-table': {
            borderSpacing: '0 10px',
          },
          '& .p-organizationchart-line-down': {
            backgroundColor: '#4CAF50',
            height: '20px',
          },
          '& .p-organizationchart-line-left': {
            borderRight: '2px solid #4CAF50',
          },
          '& .p-organizationchart-line-right': {
            borderLeft: '2px solid #4CAF50',
          },
          '& .p-organizationchart-line-top': {
            borderTop: '2px solid #4CAF50',
          },
          '& .p-organizationchart-node-content': {
            margin: '0 10px',
          }
        }}>
          <OrganizationChart
            value={data}
            nodeTemplate={nodeTemplate}
          />
        </Box>
      ) : (
        <Typography textAlign="center">No data available</Typography>
      )}
      <Drawer
  anchor="right"
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
>
  <Box sx={{ width: 300, p: 2,mt:'64px' }}>
    {selectedUser ? (
      <>
        <Typography variant="h6">{selectedUser.name}</Typography>
        <Typography variant="body2">{selectedUser.title}</Typography>
        <img src={selectedUser.photo} alt="User" width="100" height="100" style={{ borderRadius: '50%', margin: '10px 0' }} />
      </>
    ) : (
      <Typography>No user selected</Typography>
    )}
  </Box>
</Drawer>

    </Box>
  );
};

export default CompanyStructure;