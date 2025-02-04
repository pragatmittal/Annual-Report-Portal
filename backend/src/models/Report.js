const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  academicYear: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  sections: [{
    title: String,
    content: String,
    data: mongoose.Schema.Types.Mixed,
    charts: [{
      type: {
        type: String,
        enum: ['bar', 'line', 'pie', 'radar', 'scatter']
      },
      data: mongoose.Schema.Types.Mixed,
      options: mongoose.Schema.Types.Mixed
    }],
    lastModified: {
      type: Date,
      default: Date.now
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'review', 'approved', 'published'],
    default: 'draft'
  },
  contributors: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String
  }],
  approvers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    comments: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    institution: {
      name: String,
      address: String,
      contact: String
    },
    department: String,
    tags: [String],
    version: {
      type: Number,
      default: 1
    }
  },
  attachments: [{
    name: String,
    type: String,
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  publishedUrl: String,
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add text index for search functionality
reportSchema.index({
  'title': 'text',
  'sections.title': 'text',
  'sections.content': 'text',
  'metadata.tags': 'text'
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report; 