import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Divider,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

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

const ReportEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/reports/${id}`
      );
      setInitialValues(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching report details');
      setLoading(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues || {
      title: '',
      academicYear: '',
      metadata: {
        institution: {
          name: '',
          address: '',
          contact: '',
        },
        department: '',
        tags: [],
      },
      sections: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/reports/${id}`,
          values
        );
        navigate(`/reports/${id}`);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred while updating the report');
      }
    },
  });

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

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!initialValues) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Report not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Report
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
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
                name="title"
                label="Report Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="academicYear"
                label="Academic Year"
                value={formik.values.academicYear}
                onChange={formik.handleChange}
                error={
                  formik.touched.academicYear &&
                  Boolean(formik.errors.academicYear)
                }
                helperText={
                  formik.touched.academicYear && formik.errors.academicYear
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Institution Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Institution Details
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
                </Select>
              </FormControl>
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
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Report Sections */}
            <Grid item xs={12}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">Report Sections</Typography>
                <Button onClick={handleAddSection}>Add Section</Button>
              </Box>
            </Grid>

            {formik.values.sections.map((section, index) => (
              <Grid item xs={12} key={index}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">
                        Section {index + 1}
                      </Typography>
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
                    {index > 0 && (
                      <Grid item xs={12}>
                        <Button
                          color="error"
                          onClick={() => handleRemoveSection(index)}
                        >
                          Remove Section
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => navigate(`/reports/${id}`)}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
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

export default ReportEdit; 