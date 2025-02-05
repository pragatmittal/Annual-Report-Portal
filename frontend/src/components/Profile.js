import React from 'react';
import { Container, Typography } from '@mui/material';

const Profile = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1">
        Your profile information will appear here
      </Typography>
    </Container>
  );
};

export default Profile; 