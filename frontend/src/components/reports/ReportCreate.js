import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const steps = ['Basic Information', 'Institution Details', 'Report Sections'];

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  academicYear: Yup.string().required('Academic Year is required'),
  'metadata.institution.name': Yup.string().required('Institution Name is required'),
  'metadata.institution.address': Yup.string().required('Institution Address is required'),
  'metadata.institution.contact': Yup.string().required('Institution Contact is required'),
  'metadata.department': Yup.string().required('Department is required'),
  sections: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required('Section Title is required'),
      content: Yup.string().required('Section Content is required'),
    })
  ),
});

const ReportCreate = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const formik = useFormik({
    initialValues: {
      title: '',
      academicYear: new Date().getFullYear().toString(),
      metadata: {
        institution: {
          name: '',
          address: '',
          contact: '',
        },
        department: user?.department || '',
        tags: [],
      },
      sections: [
        {
          title: '',
          content: '',
          data: {},
        },
      ],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/reports`,
          values
        );
        navigate(`/reports/${response.data._id}`);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred while creating the report');
      }
    },
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleAddSection = () => {
    formik.setFieldValue('sections', [
      ...formik.values.sections,
      {
        title: '',
        content: '',
        data: {},
      },
    ]);
  };

  const handleRemoveSection = (index) => {
    const newSections = formik.values.sections.filter((_, i) => i !== index);
    formik.setFieldValue('sections', newSections);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                label="Report Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="academicYear"
                label="Academic Year"
                value={formik.values.academicYear}
                onChange={formik.handleChange}
                error={formik.touched.academicYear && Boolean(formik.errors.academicYear)}
                helperText={formik.touched.academicYear && formik.errors.academicYear}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="metadata.institution.name"
                label="Institution Name"
                value={formik.values.metadata.institution.name}
                onChange={formik.handleChange}
                error={
                  formik.touched.metadata?.institution?.name &&
                  Boolean(formik.errors.metadata?.institution?.name)
                }
                helperText={
                  formik.touched.metadata?.institution?.name &&
                  formik.errors.metadata?.institution?.name
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="metadata.institution.address"
                label="Institution Address"
                value={formik.values.metadata.institution.address}
                onChange={formik.handleChange}
                error={
                  formik.touched.metadata?.institution?.address &&
                  Boolean(formik.errors.metadata?.institution?.address)
                }
                helperText={
                  formik.touched.metadata?.institution?.address &&
                  formik.errors.metadata?.institution?.address
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="metadata.institution.contact"
                label="Institution Contact"
                value={formik.values.metadata.institution.contact}
                onChange={formik.handleChange}
                error={
                  formik.touched.metadata?.institution?.contact &&
                  Boolean(formik.errors.metadata?.institution?.contact)
                }
                helperText={
                  formik.touched.metadata?.institution?.contact &&
                  formik.errors.metadata?.institution?.contact
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  name="metadata.department"
                  value={formik.values.metadata.department}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.metadata?.department &&
                    Boolean(formik.errors.metadata?.department)
                  }
                >
                  <MenuItem value="Computer Science">Computer Science</MenuItem>
                  <MenuItem value="Mathematics">Mathematics</MenuItem>
                  <MenuItem value="Physics">Physics</MenuItem>
                  <MenuItem value="Chemistry">Chemistry</MenuItem>
                  <MenuItem value="Biology">Biology</MenuItem>
                  <MenuItem value="Engineering">Engineering</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Box>
            {formik.values.sections.map((section, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">Section {index + 1}</Typography>
                      {index > 0 && (
                        <Button
                          color="error"
                          onClick={() => handleRemoveSection(index)}
                        >
                          Remove Section
                        </Button>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name={`sections.${index}.title`}
                      label="Section Title"
                      value={section.title}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.sections?.[index]?.title &&
                        Boolean(formik.errors.sections?.[index]?.title)
                      }
                      helperText={
                        formik.touched.sections?.[index]?.title &&
                        formik.errors.sections?.[index]?.title
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      name={`sections.${index}.content`}
                      label="Section Content"
                      value={section.content}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.sections?.[index]?.content &&
                        Boolean(formik.errors.sections?.[index]?.content)
                      }
                      helperText={
                        formik.touched.sections?.[index]?.content &&
                        formik.errors.sections?.[index]?.content
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button onClick={handleAddSection}>Add Section</Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Report
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={formik.handleSubmit}>
          {getStepContent(activeStep)}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            {activeStep > 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Creating...
                  </>
                ) : 'Submit Report'}
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ReportCreate; 