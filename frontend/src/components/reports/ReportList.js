import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const statusColors = {
  draft: 'default',
  review: 'warning',
  approved: 'success',
  published: 'info',
};

const ReportList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  useEffect(() => {
    fetchReports();
  }, [page, rowsPerPage, search, statusFilter, yearFilter]);

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/reports`,
        {
          params: {
            page: page + 1,
            limit: rowsPerPage,
            search,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            academicYear: yearFilter !== 'all' ? yearFilter : undefined,
          },
        }
      );
      setReports(response.data.reports);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/reports/${id}`);
        fetchReports();
      } catch (error) {
        console.error('Error deleting report:', error);
      }
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h4" component="h1">
          Reports
        </Typography>
        {user?.permissions?.includes('create') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/reports/create')}
          >
            Create New Report
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          variant="outlined"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="review">Review</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="published">Published</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={yearFilter}
            label="Year"
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="2024">2024</MenuItem>
            <MenuItem value="2023">2023</MenuItem>
            <MenuItem value="2022">2022</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Academic Year</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Modified</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report._id}>
                <TableCell>{report.title}</TableCell>
                <TableCell>{report.academicYear}</TableCell>
                <TableCell>{report.metadata.department}</TableCell>
                <TableCell>
                  <Chip
                    label={report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    color={statusColors[report.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(report.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/reports/${report._id}`)}
                  >
                    <ViewIcon />
                  </IconButton>
                  {user?.permissions?.includes('edit') && (
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/reports/${report._id}/edit`)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {user?.permissions?.includes('delete') && (
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(report._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={reports.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Container>
  );
};

export default ReportList; 