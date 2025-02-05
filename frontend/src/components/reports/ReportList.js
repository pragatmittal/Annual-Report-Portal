import React, { useState, useEffect, useCallback } from 'react';
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
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

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

  const fetchReports = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/reports`,
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
      setReports(response.data.reports || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  }, [page, rowsPerPage, search, statusFilter, yearFilter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

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
        await axios.delete(`${process.env.REACT_APP_API_URL}/reports/${id}`);
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
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Reports</Typography>
        {user && (
          <Button
            component={Link}
            to="/reports/create"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Create Report
          </Button>
        )}
      </Box>
      <Paper sx={{ p: 2 }}>
        {reports.length > 0 ? (
          <>
            <Box sx={{ mb: 3 }}>
              <TextField
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
                sx={{ mr: 2 }}
              />
              <FormControl sx={{ minWidth: 120, mr: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="review">In Review</MenuItem>
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
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Academic Year</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report._id}>
                      <TableCell>{report.title}</TableCell>
                      <TableCell>
                        <Chip
                          label={report.status}
                          color={statusColors[report.status]}
                        />
                      </TableCell>
                      <TableCell>{report.academicYear}</TableCell>
                      <TableCell>{report.metadata?.department}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => navigate(`/reports/${report._id}`)}
                        >
                          <ViewIcon />
                        </IconButton>
                        {user && (
                          <>
                            <IconButton
                              onClick={() =>
                                navigate(`/reports/${report._id}/edit`)
                              }
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(report._id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={reports.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </>
        ) : (
          <Typography variant="body1">No reports found.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ReportList; 