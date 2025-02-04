import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const statusColors = {
  draft: 'default',
  review: 'warning',
  approved: 'success',
  published: 'info',
};

const ReportView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewStatus, setReviewStatus] = useState('');

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/reports/${id}`
      );
      setReport(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching report details');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/reports/${id}`);
        navigate('/reports');
      } catch (err) {
        setError('Error deleting report');
      }
    }
  };

  const handleSubmitForReview = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reports/${id}/submit`
      );
      fetchReport();
    } catch (err) {
      setError('Error submitting report for review');
    }
  };

  const handleReviewSubmit = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reports/${id}/review`,
        {
          status: reviewStatus,
          comments: reviewComment,
        }
      );
      setReviewDialogOpen(false);
      fetchReport();
    } catch (err) {
      setError('Error submitting review');
    }
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

  if (!report) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Report not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1">
            {report.title}
          </Typography>
          <Box>
            <Chip
              label={
                report.status.charAt(0).toUpperCase() + report.status.slice(1)
              }
              color={statusColors[report.status]}
              sx={{ mr: 1 }}
            />
            {user?.permissions?.includes('edit') && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/reports/${id}/edit`)}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
            )}
            {user?.permissions?.includes('delete') && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </Box>
        </Box>

        {/* Metadata */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Academic Year
            </Typography>
            <Typography variant="body1">{report.academicYear}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Department
            </Typography>
            <Typography variant="body1">
              {report.metadata.department}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Institution
            </Typography>
            <Typography variant="body1">
              {report.metadata.institution.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {report.metadata.institution.address}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {report.metadata.institution.contact}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4 }} />

        {/* Sections */}
        {report.sections.map((section, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {section.title}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {section.content}
            </Typography>
            {section.charts && section.charts.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {/* Add chart visualizations here */}
              </Box>
            )}
          </Box>
        ))}

        {/* Action Buttons */}
        <Box sx={{ mt: 4 }}>
          {report.status === 'draft' &&
            user?.permissions?.includes('edit') && (
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handleSubmitForReview}
              >
                Submit for Review
              </Button>
            )}
          {report.status === 'review' &&
            user?.role === 'admin' && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ApproveIcon />}
                  onClick={() => {
                    setReviewStatus('approved');
                    setReviewDialogOpen(true);
                  }}
                  sx={{ mr: 1 }}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<RejectIcon />}
                  onClick={() => {
                    setReviewStatus('rejected');
                    setReviewDialogOpen(true);
                  }}
                >
                  Reject
                </Button>
              </>
            )}
        </Box>
      </Paper>

      {/* Review Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {reviewStatus === 'approved' ? 'Approve Report' : 'Reject Report'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comments"
            fullWidth
            multiline
            rows={4}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleReviewSubmit}
            variant="contained"
            color={reviewStatus === 'approved' ? 'success' : 'error'}
          >
            {reviewStatus === 'approved' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReportView; 