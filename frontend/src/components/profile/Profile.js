import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Username</Typography>
            <Typography>{user?.username || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Email</Typography>
            <Typography>{user?.email || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Role</Typography>
            <Typography>{user?.role || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Department</Typography>
            <Typography>{user?.department || 'N/A'}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile; 