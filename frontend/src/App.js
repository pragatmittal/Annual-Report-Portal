import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import ReportList from './components/reports/ReportList';
import ReportCreate from './components/reports/ReportCreate';
import ReportView from './components/reports/ReportView';
import ReportEdit from './components/reports/ReportEdit';
import Profile from './components/Profile';
import NotFound from './components/common/NotFound';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route
                path="dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="reports"
                element={
                  <PrivateRoute>
                    <ReportList />
                  </PrivateRoute>
                }
              />
              <Route
                path="reports/create"
                element={
                  <PrivateRoute>
                    <ReportCreate />
                  </PrivateRoute>
                }
              />
              <Route
                path="reports/:id"
                element={
                  <PrivateRoute>
                    <ReportView />
                  </PrivateRoute>
                }
              />
              <Route
                path="reports/:id/edit"
                element={
                  <PrivateRoute>
                    <ReportEdit />
                  </PrivateRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;