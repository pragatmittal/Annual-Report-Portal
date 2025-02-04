import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Description,
  PendingActions,
  CheckCircle,
} from '@mui/icons-material';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      bgcolor: `${color}.light`,
    }}
  >
    <Box>
      <Typography variant="h6" color={`${color}.dark`}>
        {title}
      </Typography>
      <Typography variant="h4" color={`${color}.dark`}>
        {value}
      </Typography>
    </Box>
    <Box
      sx={{
        bgcolor: `${color}.main`,
        borderRadius: '50%',
        p: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </Box>
  </Paper>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    completedReports: 0,
  });
  const [monthlyData, setMonthlyData] = useState({
    labels: [],
    datasets: [],
  });
  const [departmentData, setDepartmentData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real application, these would be actual API calls
        // For now, we'll simulate the data
        setStats({
          totalReports: 45,
          pendingReports: 12,
          completedReports: 33,
        });

        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];

        setMonthlyData({
          labels: months,
          datasets: [
            {
              label: 'Reports Created',
              data: [12, 19, 3, 5, 2, 3, 8, 14, 10, 15, 9, 6],
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        });

        setDepartmentData({
          labels: [
            'Computer Science',
            'Mathematics',
            'Physics',
            'Chemistry',
            'Biology',
          ],
          datasets: [
            {
              label: 'Reports by Department',
              data: [15, 12, 8, 6, 4],
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
              ],
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
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

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Reports"
            value={stats.totalReports}
            icon={<Description sx={{ color: 'white' }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Pending Reports"
            value={stats.pendingReports}
            icon={<PendingActions sx={{ color: 'white' }} />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Completed Reports"
            value={stats.completedReports}
            icon={<CheckCircle sx={{ color: 'white' }} />}
            color="success"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Report Creation Trend
            </Typography>
            <Line
              data={monthlyData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Reports by Department
            </Typography>
            <Bar
              data={departmentData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 