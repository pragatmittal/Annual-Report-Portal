const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { auth, authorize } = require('../middleware/auth');

// Get dashboard statistics
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Get total reports count
    const totalReports = await Report.countDocuments();

    // Get reports by status
    const reportsByStatus = await Report.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get reports by department
    const reportsByDepartment = await Report.aggregate([
      {
        $group: {
          _id: '$metadata.department',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get monthly report creation trend
    const monthlyTrend = await Report.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);

    // Format status data
    const statusData = {
      draft: 0,
      review: 0,
      approved: 0,
      published: 0
    };
    reportsByStatus.forEach(item => {
      statusData[item._id] = item.count;
    });

    // Format department data
    const departmentData = {};
    reportsByDepartment.forEach(item => {
      if (item._id) {
        departmentData[item._id] = item.count;
      }
    });

    // Format monthly trend data
    const trendData = Array(12).fill(0);
    monthlyTrend.forEach(item => {
      if (item._id.year === new Date().getFullYear()) {
        trendData[item._id.month - 1] = item.count;
      }
    });

    res.json({
      totalReports,
      statusData,
      departmentData,
      trendData
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching analytics data' });
  }
});

// Get department performance metrics
router.get('/departments', auth, async (req, res) => {
  try {
    const departmentMetrics = await Report.aggregate([
      {
        $group: {
          _id: '$metadata.department',
          totalReports: { $sum: 1 },
          approved: {
            $sum: {
              $cond: [{ $eq: ['$status', 'approved'] }, 1, 0]
            }
          },
          rejected: {
            $sum: {
              $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0]
            }
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ['$status', 'review'] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json(departmentMetrics);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching department metrics' });
  }
});

// Get user activity metrics
router.get('/user-activity', [auth, authorize(['admin'])], async (req, res) => {
  try {
    const userActivity = await Report.aggregate([
      {
        $unwind: '$contributors'
      },
      {
        $group: {
          _id: '$contributors.user',
          reportCount: { $sum: 1 },
          lastActivity: { $max: '$updatedAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          username: '$userDetails.username',
          department: '$userDetails.department',
          reportCount: 1,
          lastActivity: 1
        }
      }
    ]);

    res.json(userActivity);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user activity metrics' });
  }
});

// Get report completion time metrics
router.get('/completion-time', [auth, authorize(['admin'])], async (req, res) => {
  try {
    const completionMetrics = await Report.aggregate([
      {
        $match: {
          status: { $in: ['approved', 'published'] }
        }
      },
      {
        $project: {
          department: '$metadata.department',
          completionTime: {
            $subtract: [
              { $arrayElemAt: ['$approvers.date', -1] },
              '$createdAt'
            ]
          }
        }
      },
      {
        $group: {
          _id: '$department',
          averageCompletionTime: { $avg: '$completionTime' },
          minCompletionTime: { $min: '$completionTime' },
          maxCompletionTime: { $max: '$completionTime' }
        }
      }
    ]);

    res.json(completionMetrics);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching completion time metrics' });
  }
});

module.exports = router; 