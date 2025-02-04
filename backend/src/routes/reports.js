const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Report = require('../models/Report');
const { auth, authorize, checkPermission } = require('../middleware/auth');

// Get all reports (with filtering and pagination)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, academicYear, department } = req.query;
    const query = {};

    if (status) query.status = status;
    if (academicYear) query.academicYear = academicYear;
    if (department) query['metadata.department'] = department;

    // Add role-based filtering
    if (req.user.role !== 'admin') {
      query.$or = [
        { 'contributors.user': req.user._id },
        { 'approvers.user': req.user._id }
      ];
    }

    const reports = await Report.find(query)
      .populate('contributors.user', 'username email')
      .populate('approvers.user', 'username email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Report.countDocuments(query);

    res.json({
      reports,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new report
router.post('/',
  [auth, checkPermission('create')],
  [
    body('title').trim().notEmpty(),
    body('academicYear').trim().notEmpty(),
    body('metadata.institution').notEmpty(),
    body('metadata.department').trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const report = new Report({
        ...req.body,
        contributors: [{ user: req.user._id, role: 'creator' }]
      });

      await report.save();
      res.status(201).json(report);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get report by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('contributors.user', 'username email')
      .populate('approvers.user', 'username email');

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update report
router.put('/:id',
  [auth, checkPermission('edit')],
  async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);

      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      // Check if user is a contributor
      const isContributor = report.contributors.some(
        c => c.user.toString() === req.user._id.toString()
      );

      if (!isContributor && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      // Update report
      Object.assign(report, req.body);
      await report.save();

      res.json(report);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Add/Update section
router.post('/:id/sections',
  [auth, checkPermission('edit')],
  [
    body('title').trim().notEmpty(),
    body('content').optional().trim()
  ],
  async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);

      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      const section = {
        ...req.body,
        modifiedBy: req.user._id,
        lastModified: new Date()
      };

      report.sections.push(section);
      await report.save();

      res.json(report);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Submit for review
router.post('/:id/submit',
  [auth, checkPermission('edit')],
  async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);

      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      report.status = 'review';
      await report.save();

      res.json(report);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Approve/Reject report
router.post('/:id/review',
  [auth, authorize(['admin'])],
  [
    body('status').isIn(['approved', 'rejected']),
    body('comments').optional().trim()
  ],
  async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);

      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      const { status, comments } = req.body;

      report.approvers.push({
        user: req.user._id,
        status,
        comments,
        date: new Date()
      });

      report.status = status;
      await report.save();

      res.json(report);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete report
router.delete('/:id',
  [auth, authorize(['admin'])],
  async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);

      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      await report.remove();
      res.json({ message: 'Report deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router; 