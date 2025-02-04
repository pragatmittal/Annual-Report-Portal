import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Avatar,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  currentPassword: Yup.string().when('newPassword', {
    is: (val) => val && val.length > 0,
    then: Yup.string().required('Current password is required to change password'),
  }),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .nullable(),
  confirmNewPassword: Yup.string().when('newPassword', {
    is: (val) => val && val.length > 0,
    then: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Confirm password is required'),
  }),
  department: Yup.string().required('Department is required'),
});

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formik = useFormik({
    initialValues: {
      username: user?.username || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      department: user?.department || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const updateData = {
          username: values.username,
          email: values.email,
          department: values.department,
        };

        if (values.newPassword) {
          updateData.currentPassword = values.currentPassword;
          updateData.newPassword = values.newPassword;
        }

        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/users/profile`,
          updateData
        );

        updateUser(response.data);
        setSuccess('Profile updated successfully');
        setError('');

        // Reset password fields
        formik.setFieldValue('currentPassword', '');
        formik.setFieldValue('newPassword', '');
        formik.setFieldValue('confirmNewPassword', '');
      } catch (err) {
        setError(
          err.response?.data?.error || 'An error occurred while updating profile'
        );
        setSuccess('');
      }
    },
  });

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mb={4}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2rem',
              mb: 2,
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h4" component="h1" gutterBottom>
            Profile Settings
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="username"
                label="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.department && Boolean(formik.errors.department)
                  }
                >
                  <MenuItem value="Computer Science">Computer Science</MenuItem>
                  <MenuItem value="Mathematics">Mathematics</MenuItem>
                  <MenuItem value="Physics">Physics</MenuItem>
                  <MenuItem value="Chemistry">Chemistry</MenuItem>
                  <MenuItem value="Biology">Biology</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Change Password */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="currentPassword"
                label="Current Password"
                type="password"
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.currentPassword &&
                  Boolean(formik.errors.currentPassword)
                }
                helperText={
                  formik.touched.currentPassword &&
                  formik.errors.currentPassword
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.newPassword &&
                  Boolean(formik.errors.newPassword)
                }
                helperText={
                  formik.touched.newPassword && formik.errors.newPassword
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="confirmNewPassword"
                label="Confirm New Password"
                type="password"
                value={formik.values.confirmNewPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.confirmNewPassword &&
                  Boolean(formik.errors.confirmNewPassword)
                }
                helperText={
                  formik.touched.confirmNewPassword &&
                  formik.errors.confirmNewPassword
                }
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
            >
              Save Changes
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile; 