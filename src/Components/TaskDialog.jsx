import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, CircularProgress, IconButton 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const TaskDialog = ({ open, onClose, task, companyName, employeeId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        status: newStatus,
        companyName
      };

      await axios.put(`http://localhost:5000/api/tasks/${task.id}/status`, payload);
      onClose({ ...task, status: newStatus });
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => onClose(task)} 
      maxWidth="sm" 
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          bgcolor: '#fff'
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid #f0f0f0'
      }}>
        <DialogTitle sx={{ p: 0, fontWeight: 600 }}>
          {task.name}
        </DialogTitle>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {task.status !== 'Completed' && (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleStatusChange('In Progress')}
              disabled={loading}
              sx={{
                bgcolor: '#1976d2',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': { bgcolor: '#1565c0' }
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 
                task.status === 'In Progress' ? 'Working' : 'Start'}
            </Button>
          )}
          {task.status === 'In Progress' && (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleStatusChange('Completed')}
              disabled={loading}
              sx={{
                bgcolor: '#2e7d32',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': { bgcolor: '#1b5e20' }
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Finish'}
            </Button>
          )}
          <IconButton 
            onClick={() => onClose(task)} 
            disabled={loading}
            sx={{ 
              color: '#666',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1">
              {task.description}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Due Date
              </Typography>
              <Typography variant="body2">
                {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Status
              </Typography>
              <Typography variant="body2">
                {task.status}
              </Typography>
            </Box>
          </Box>

          {error && (
            <Typography 
              color="error" 
              variant="body2" 
              sx={{ 
                mt: 2, 
                p: 2, 
                bgcolor: '#fef2f2', 
                borderRadius: 1 
              }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;