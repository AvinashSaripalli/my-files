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
} from '@mui/material';

const sampleWorkgroups = [
  { id: 1, companyName: 'Tech Corp', createdOn: '2025-01-15', privacyType: 'public' },
  { id: 2, companyName: 'Innovate Ltd', createdOn: '2025-02-20', privacyType: 'private' },
  { id: 3, companyName: 'Global Solutions', createdOn: '2025-03-10', privacyType: 'public' },
  { id: 4, companyName: 'NextGen Systems', createdOn: '2025-03-25', privacyType: 'private' },
  { id: 5, companyName: 'Quantum Works', createdOn: '2025-04-05', privacyType: 'public' },
  { id: 6, companyName: 'Cybernetic Labs', createdOn: '2025-04-18', privacyType: 'private' },
  { id: 7, companyName: 'AI Pioneers', createdOn: '2025-05-02', privacyType: 'public' },
  { id: 8, companyName: 'NeoTech Solutions', createdOn: '2025-05-10', privacyType: 'private' },
  { id: 9, companyName: 'Digital Minds', createdOn: '2025-05-15', privacyType: 'public' },
  { id: 10, companyName: 'CodeFusion Inc', createdOn: '2025-05-20', privacyType: 'private' }
];


const Workgroups = () => {
  const [workgroups, setWorkgroups] = useState([]);

  useEffect(() => {
    // Set example data
    setWorkgroups(sampleWorkgroups);
  }, []);

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
          <TableHead sx={{ backgroundColor: '#f4f7fe' , height:"80px"}}>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
                ID
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
                Company Name
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
                Created On
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
                Privacy Type
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workgroups.length > 0 ? (
              workgroups.map((workgroup) => (
                <TableRow key={workgroup.id}>
                  <TableCell align="center">{workgroup.id}</TableCell>
                  <TableCell align="left">{workgroup.companyName}</TableCell>
                  <TableCell align="left">{workgroup.createdOn}</TableCell>
                  <TableCell align="left">{workgroup.privacyType}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No workgroups found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Workgroups;