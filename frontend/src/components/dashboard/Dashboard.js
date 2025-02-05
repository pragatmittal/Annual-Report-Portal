import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Reports</Typography>
            <Typography variant="h3">0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Pending Reviews</Typography>
            <Typography variant="h3">0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Approved Reports</Typography>
            <Typography variant="h3">0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Published Reports</Typography>
            <Typography variant="h3">0</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 