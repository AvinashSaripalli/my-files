import React, { useEffect, useState } from 'react';
import { OrganizationChart } from 'primereact/organizationchart';
import { Box, Typography } from '@mui/material';

const CompanyStructure = () => {
  const [data, setData] = useState([]);

  const sampleData = [
    {
      label: 'John Doe',
      position: 'CEO',
      type: 'executive',
      expanded: true,
      children: [
        {
          label: 'Jane Smith',
          position: 'CTO',
          type: 'management',
          expanded: true,
          children: [
            {
              label: 'Mike Johnson',
              position: 'Lead Developer',
              type: 'team-lead',
            },
            {
              label: 'Sarah Williams',
              position: 'Senior Developer',
              type: 'developer',
            }
          ],
        },
        {
          label: 'Robert Brown',
          position: 'CFO',
          type: 'management',
          expanded: true,
          children: [
            {
              label: 'Emily Davis',
              position: 'Accounting Manager',
              type: 'team-lead',
            }
          ],
        },
        {
          label: 'Lisa Anderson',
          position: 'HR Manager',
          type: 'management',
        },
      ],
    },
  ];

  useEffect(() => {
    setData(sampleData);
  }, []);

  const nodeTemplate = (node) => {
    const nodeStyles = {
      executive: {
        backgroundColor: '#3f51b5',
        color: '#ffffff',
        border: '1px solid #303f9f',
      },
      management: {
        backgroundColor: '#2196f3',
        color: '#ffffff',
        border: '1px solid #1976d2',
      },
      'team-lead': {
        backgroundColor: '#4caf50',
        color: '#ffffff',
        border: '1px solid #388e3c',
      },
      developer: {
        backgroundColor: '#ff9800',
        color: '#ffffff',
        border: '1px solid #f57c00',
      },
    };

    const style = nodeStyles[node.type] || {
      backgroundColor: '#f4f7fe',
      color: '#000000',
      border: '1px solid #e0e0e0',
    };

    return (
      <Box
        sx={{
          padding: 2,
          borderRadius: '8px',
          textAlign: 'center',
          ...style,
          minWidth: '150px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant='h6' sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
          {node.label}
        </Typography>
        <Typography variant='body2' sx={{ fontSize: '0.85rem' }}>
          {node.position}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant='h5' sx={{ mb: 3, fontWeight: 'bold' }}>
        Company Structure
      </Typography>
      {data.length > 0 ? (
        <OrganizationChart
          value={data}
          nodeTemplate={nodeTemplate}
          className='organizationchart-custom'
          style={{ overflowX: 'auto', width: '100%' }}
        />
      ) : (
        <Typography variant='body1'>Loading Company Structure...</Typography>
      )}
    </Box>
  );
};

export default CompanyStructure;
